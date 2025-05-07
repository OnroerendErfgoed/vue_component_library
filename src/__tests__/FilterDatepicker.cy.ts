/* eslint-disable vue/one-component-per-file */
import FilterDatepicker from '../components/dumb/FilterDatepicker.vue';
import { defineComponent, ref } from 'vue';

describe('FilterDatepicker', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => {
      // Return false to prevent Cypress from failing the test
      // Issue caused by Webuniversum component throwing an error
      // [cleave.js] Please check the element
      return false;
    });
  });

  describe('default', () => {
    const TestComponent = defineComponent({
      components: { FilterDatepicker },
      setup() {
        const date = ref<string>();
        const setValue = (value: string) => (date.value = value);
        return { date, setValue };
      },
      template: '<filter-datepicker :value="date" @update:value="setValue"/>',
    });

    it('accepts a value prop', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.date = '1996-02-16';
        cy.dataCy('filter-datepicker').find('.flatpickr-input').should('have.value', '16-02-1996');
      });
    });

    it('emits an update:value event', () => {
      const onUpdateValueSpy = cy.spy().as('onUpdateValueSpy');

      cy.mount(TestComponent, { props: { 'onUpdate:value': onUpdateValueSpy } }).then(({ component }) => {
        cy.dataCy('filter-datepicker')
          .parent()
          .find('.vl-datepicker__input-field')
          .type('16-02-1996')
          .wait(200)
          .then(() => {
            expect(component.date).to.deep.equal('1996-02-16');
          });

        cy.get('@onUpdateValueSpy').should('have.been.calledWith', '1996-02-16');
      });
    });

    it('renders a placeholder', () => {
      cy.mount(TestComponent);
      cy.dataCy('filter-datepicker').find('.flatpickr-input').should('have.attr', 'placeholder', 'dd-mm-jjjj');
    });
  });

  describe('custom api format - dd-MM-yyyy', () => {
    const TestComponent = defineComponent({
      components: { FilterDatepicker },
      setup() {
        const apiFormat = 'dd-MM-yyyy';
        const date = ref<string>();
        const setValue = (value: string) => (date.value = value);
        return { date, setValue, apiFormat };
      },
      template: '<filter-datepicker :apiFormat="apiFormat" :value="date" @update:value="setValue"/>',
    });

    it('accepts a value prop', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.date = '16-02-1996';
        cy.dataCy('filter-datepicker').find('.flatpickr-input').should('have.value', '16-02-1996');
      });
    });

    it('emits an update:value event', () => {
      const onUpdateValueSpy = cy.spy().as('onUpdateValueSpy');

      cy.mount(TestComponent, { props: { 'onUpdate:value': onUpdateValueSpy } }).then(({ component }) => {
        cy.dataCy('filter-datepicker')
          .parent()
          .find('.vl-datepicker__input-field')
          .type('16-02-1996')
          .wait(200)
          .then(() => {
            expect(component.date).to.deep.equal('16-02-1996');
          });

        cy.get('@onUpdateValueSpy').should('have.been.calledWith', '16-02-1996');
      });
    });
  });
});
