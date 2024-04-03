import { defineComponent, ref } from 'vue';
import FilterText from '@components/dumb/FilterText.vue';

describe('FilterText', () => {
  const TestComponent = defineComponent({
    components: { FilterText },
    setup() {
      const textValue = ref('');
      return { textValue };
    },
    template:
      '<filter-text placeholder="Enter some text" :value="textValue" @update:value="$event => textValue=$event"/>',
  });

  it('accepts a value prop', () => {
    cy.mount(TestComponent).then(({ component }) => {
      component.textValue = 'Initial value';
      cy.dataCy('filter-text').should('have.value', 'Initial value');
    });
  });

  it('emits an update:value event', () => {
    cy.mount(TestComponent).then(({ component }) => {
      cy.dataCy('filter-text')
        .type('fwef')
        .then(() => {
          expect(component.textValue).to.equal('fwef');
        });
    });
  });

  it('renders a placeholder', () => {
    cy.mount(TestComponent);
    cy.dataCy('filter-text').should('have.attr', 'placeholder', 'Enter some text');
  });
});
