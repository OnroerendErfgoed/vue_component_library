import { defineComponent, ref } from 'vue';
import { OeTinyMCE } from '@components/editor';

describe('OeTinyMCE', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeTinyMCE },
      setup() {
        const data = ref('<p>Test</p>');
        return { data };
      },
      template: '<OeTinyMCE v-model="data" />',
    });

    beforeEach(() => {
      cy.viewport('macbook-16');
    });

    it('renders a rich text editor', () => {
      cy.mount(TestComponent).then(() => {
        cy.dataCy('editor').should('exist');
      });
    });

    const getIframeDocument = () => {
      return cy.get('iframe').its('0.contentDocument').should('exist');
    };

    const getIframeBody = () => {
      return getIframeDocument().its('body').should('not.be.undefined').then(cy.wrap);
    };

    it('renders a rich text editor with the provided value', () => {
      cy.mount(TestComponent).then(() => {
        getIframeBody().should('have.html', '<p>Test</p>');
      });
    });

    it('update the data when changed', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.data = '<h1>Test</h1>';
        getIframeBody().should('have.html', '<h1>Test</h1>');
      });
    });
  });
});
