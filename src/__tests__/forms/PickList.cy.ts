/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import OePickList from '@components/forms/dumb/OePickList.vue';

interface ITestItem {
  id: number;
  name: string;
}

const items: ITestItem[] = [
  { id: 1, name: 'Item A' },
  { id: 2, name: 'Item B' },
  { id: 3, name: 'Item C' },
];

const itemText = (item: ITestItem) => item.name;

describe('PickList', () => {
  describe('view mode', () => {
    const TestComponent = defineComponent({
      components: { OePickList },
      setup() {
        const selectedItems = ref<ITestItem[]>([...items]);
        return { selectedItems, itemText };
      },
      template: `
        <OePickList
          :selected-items="selectedItems"
          item-label="item"
          :item-text="itemText"
          :is-edit-mode="false"
        >
          <template #input><input data-cy="input-slot" /></template>
        </OePickList>
      `,
    });

    it('renders a list of selected items', () => {
      cy.mount(TestComponent);
      cy.get('.pick-list').should('exist').find('li').should('have.length', items.length);
    });

    it('displays the item text for each item', () => {
      cy.mount(TestComponent);
      cy.get('.pick-list li').each((li, index) => {
        expect(li.text().trim()).to.equal(items[index].name);
      });
    });

    it('does not render delete buttons', () => {
      cy.mount(TestComponent);
      cy.get('.pick-list .vl-button').should('not.exist');
    });

    it('does not render the input slot', () => {
      cy.mount(TestComponent);
      cy.get('[data-cy="input-slot"]').should('not.exist');
    });

    it('does not apply edit mode classes', () => {
      cy.mount(TestComponent);
      cy.get('.pick-list').should('not.have.class', 'vl-u-spacer-top--small').should('not.have.class', 'divider');
    });
  });

  describe('edit mode', () => {
    const TestComponent = defineComponent({
      components: { OePickList },
      setup() {
        const selectedItems = ref<ITestItem[]>([...items]);
        return { selectedItems, itemText };
      },
      template: `
        <OePickList
          :selected-items="selectedItems"
          item-label="item"
          :item-text="itemText"
          :is-edit-mode="true"
        >
          <template #input><input data-cy="input-slot" /></template>
        </OePickList>
      `,
    });

    it('renders the input slot', () => {
      cy.mount(TestComponent);
      cy.get('[data-cy="input-slot"]').should('exist').should('be.visible');
    });

    it('renders delete buttons for each item', () => {
      cy.mount(TestComponent);
      cy.get('.pick-list .vl-button').should('have.length', items.length);
    });

    it('renders delete buttons with correct aria-label', () => {
      cy.mount(TestComponent);
      cy.get('.pick-list .vl-button').each((btn) => {
        cy.wrap(btn).should('have.attr', 'aria-label', 'Verwijder item');
      });
    });

    it('renders delete buttons with correct title', () => {
      cy.mount(TestComponent);
      cy.get('.pick-list .vl-button').each((btn) => {
        cy.wrap(btn).should('have.attr', 'title', 'Verwijder item');
      });
    });

    it('applies edit mode classes', () => {
      cy.mount(TestComponent);
      cy.get('.pick-list').should('have.class', 'vl-u-spacer-top--small').should('have.class', 'divider');
    });

    it('emits unselect event when delete button is clicked', () => {
      const onUnselectSpy = cy.spy().as('onUnselect');
      cy.mount(TestComponent, { props: { onUnselect: onUnselectSpy } });

      cy.get('.pick-list .vl-button')
        .first()
        .click()
        .then(() => {
          cy.get('@onUnselect').should('have.been.calledOnce');
          cy.get('@onUnselect').should('have.been.calledWith', items[0]);
        });
    });

    it('emits unselect event with the correct item for each button', () => {
      const onUnselectSpy = cy.spy().as('onUnselect');
      cy.mount(TestComponent, { props: { onUnselect: onUnselectSpy } });

      cy.get('.pick-list .vl-button')
        .eq(1)
        .click()
        .then(() => {
          cy.get('@onUnselect').should('have.been.calledWith', items[1]);
        });
    });
  });

  describe('disabled', () => {
    const TestComponent = defineComponent({
      components: { OePickList },
      setup() {
        const selectedItems = ref<ITestItem[]>([...items]);
        return { selectedItems, itemText };
      },
      template: `
        <OePickList
          :selected-items="selectedItems"
          item-label="item"
          :item-text="itemText"
          :is-edit-mode="true"
          :disabled="true"
        >
          <template #input><input data-cy="input-slot" /></template>
        </OePickList>
      `,
    });

    it('does not render delete buttons when disabled in edit mode', () => {
      cy.mount(TestComponent);
      cy.get('.pick-list .vl-button').should('not.exist');
    });

    it('still renders the item text', () => {
      cy.mount(TestComponent);
      cy.get('.pick-list li').should('have.length', items.length);
      cy.get('.pick-list li').each((li, index) => {
        expect(li.text().trim()).to.equal(items[index].name);
      });
    });

    it('still renders the input slot', () => {
      cy.mount(TestComponent);
      cy.get('[data-cy="input-slot"]').should('exist');
    });
  });

  describe('empty list', () => {
    const TestComponent = defineComponent({
      components: { OePickList },
      setup() {
        const selectedItems = ref<ITestItem[]>([]);
        return { selectedItems, itemText };
      },
      template: `
        <OePickList
          :selected-items="selectedItems"
          item-label="item"
          :item-text="itemText"
          :is-edit-mode="true"
        />
      `,
    });

    it('renders an empty list', () => {
      cy.mount(TestComponent);
      cy.get('.pick-list').should('exist');
      cy.get('.pick-list li').should('have.length', 0);
    });
  });

  describe('reactive updates', () => {
    const TestComponent = defineComponent({
      components: { OePickList },
      setup() {
        const selectedItems = ref<ITestItem[]>([items[0]]);
        return { selectedItems, itemText };
      },
      template: `
        <OePickList
          :selected-items="selectedItems"
          item-label="item"
          :item-text="itemText"
          :is-edit-mode="false"
        />
      `,
    });

    it('updates the list when selectedItems changes', () => {
      cy.mount(TestComponent).then(({ component }) => {
        cy.get('.pick-list li').should('have.length', 1);
        component.selectedItems = [...items];
        cy.get('.pick-list li').should('have.length', items.length);
      });
    });

    it('removes items from the rendered list when selectedItems shrinks', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.selectedItems = [...items];
        cy.get('.pick-list li')
          .should('have.length', items.length)
          .then(() => {
            component.selectedItems = [items[0]];
          });
        cy.get('.pick-list li').should('have.length', 1);
      });
    });
  });

  describe('custom itemLabel', () => {
    it('uses the provided itemLabel in delete button attributes', () => {
      const TestComponent = defineComponent({
        components: { OePickList },
        setup() {
          const selectedItems = ref<ITestItem[]>([items[0]]);
          return { selectedItems, itemText };
        },
        template: `
          <OePickList
            :selected-items="selectedItems"
            item-label="categorie"
            :item-text="itemText"
            :is-edit-mode="true"
          />
        `,
      });

      cy.mount(TestComponent);
      cy.get('.pick-list .vl-button')
        .first()
        .should('have.attr', 'aria-label', 'Verwijder categorie')
        .should('have.attr', 'title', 'Verwijder categorie');
    });
  });
});
