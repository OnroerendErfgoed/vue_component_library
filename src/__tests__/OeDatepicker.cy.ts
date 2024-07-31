import { defineComponent, ref } from 'vue';
import OeDatepicker from '@components/dumb/OeDatepicker.vue';

describe('Datepicker', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeDatepicker },
      setup() {
        const date = ref();
        return { date };
      },
      template: '<oe-datepicker v-model="date" />',
    });

    it('renders a placeholder', () => {
      cy.mount(TestComponent);
      cy.dataCy('datepicker').should('have.attr', 'placeholder', 'dd-mm-jjjj');
    });

    it('should be empty', () => {
      cy.mount(TestComponent);
      cy.dataCy('datepicker').get('.vl-datepicker__input-field').should('have.value', '');
    });

    it('should set the value', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.date = '2024-07-29';
        cy.dataCy('datepicker').get('.vl-datepicker__input-field').should('have.value', '29-07-2024');
      });
    });

    it('accepts manual input (format dd-mm-yyyy) and sets model to api format (yyyy-mm-dd)', () => {
      cy.mount(TestComponent).then(({ component }) => {
        cy.dataCy('datepicker')
          .get('.vl-datepicker__input-field')
          .type('24-07-2024')
          .wait(200)
          .then(() => {
            expect(component.date).to.equal('2024-07-24');
          });
      });
    });

    it('should clear the value', () => {
      cy.mount(TestComponent).then(({ component }) => {
        component.date = '2024-07-29';
        cy.dataCy('datepicker')
          .get('.vl-datepicker__input-field')
          .clear()
          .type('{enter}')
          .then(() => {
            expect(component.date).to.equal(null);
          });
      });
    });
  });
});
