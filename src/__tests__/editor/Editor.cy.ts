import { defineComponent, ref } from 'vue';
import { OeEditor, OeEditorToolbar } from '@components/editor';
import { mount } from 'cypress/vue';

const mountEditor = (initialValue = '') => {
  const TestComponent = defineComponent({
    components: { OeEditor },
    setup() {
      const value = ref(initialValue);
      const toolbar = ref<OeEditorToolbar[]>([
        OeEditorToolbar.BULLIST,
        OeEditorToolbar.NUMLIST,
        OeEditorToolbar.INDENT,
        OeEditorToolbar.OUTDENT,
      ]);

      return { value, toolbar };
    },
    template: `
      <OeEditor
        id="editor-test"
        v-model="value"
        :toolbar="toolbar"
      />
    `,
  });

  return mount(TestComponent);
};

describe('OeEditor', () => {
  it('preserves the Quill indent class and adds inline padding', () => {
    mountEditor('<p>Test</p>').then(({ component }) => {
      cy.get('.ql-editor p').click();
      cy.get('.ql-indent[value="+1"]').click();

      cy.get('.ql-editor p')
        .should('have.class', 'ql-indent-1')
        .and('have.attr', 'style')
        .and('contain', 'padding-left: 3em');

      cy.then(() => {
        expect(component.value).to.contain('class="ql-indent-1"');
        expect(component.value).to.contain('padding-left: 3em');
      });
    });
  });

  it('returns bullet lists as semantic HTML', () => {
    mountEditor('<p>Item 1</p>').then(({ component }) => {
      cy.get('.ql-editor p').click();
      cy.get('.ql-list[value="bullet"]').click();

      cy.then(() => {
        expect(component.value).to.contain('<ul>');
        expect(component.value).to.contain('<li>');
        expect(component.value).to.contain('Item&nbsp;1');
        expect(component.value).not.to.contain('data-list="bullet"');
      });
    });
  });
});
