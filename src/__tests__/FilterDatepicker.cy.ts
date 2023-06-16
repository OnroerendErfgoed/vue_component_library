import { defineComponent, ref } from 'vue';
import FilterDatepicker from '../components/dumb/FilterDatepicker.vue';

describe('FilterDatepicker', () => {
  const TestComponent = defineComponent({
    components: { FilterDatepicker },
    setup() {
      const date = ref<string[]>([]);
      const setValue = (value: string[]) => (date.value = value);
      return { date, setValue };
    },
    template: '<filter-datepicker :value="date" @update:value="setValue"/>',
  });

  it('accepts a value prop', () => {
    cy.mount(TestComponent).then(({ component }) => {
      component.date = ['16-02-1996'];
      cy.dataCy('filter-datepicker').should('have.value', '16-02-1996');
    });
  });

  it('emits an update:value event', () => {
    cy.mount(TestComponent).then(({ component }) => {
      cy.dataCy('filter-datepicker')
        .parent()
        .find('.vl-datepicker__input-field')
        .type('16-02-1996')
        .wait(200)
        .then(() => {
          expect(component.date).to.deep.equal(['16-02-1996']);
        });
    });
  });

  it('renders a placeholder', () => {
    cy.mount(TestComponent);
    cy.dataCy('filter-datepicker').should('have.attr', 'placeholder', 'dd-mm-jjjj');
  });
});
