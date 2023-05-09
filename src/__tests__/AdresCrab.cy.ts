import AdresCrab from '@components/smart/AdresCrab.vue';
import { mount } from 'cypress/vue';
import { defineComponent } from 'vue';

describe('Adres CRAB', () => {
  const TestComponent = defineComponent({
    components: { AdresCrab },
    template: '<Suspense><AdresCrab/></Suspense>',
  });

  it('renders', () => {
    mount(TestComponent);
  });

  it('has a title adres', () => {
    mount(TestComponent);
    cy.get('[data-cy="title-adres"]').should('have.text', 'Adres');
  });

  describe('form - default', () => {
    beforeEach(() => {
      mount(TestComponent);
    });

    it('has an input label land - required', () => {
      cy.checkLabel('land', 'Land(verplicht)');
    });

    it('has an input label gemeente - required', () => {
      cy.checkLabel('gemeente', 'Gemeente(verplicht)');
    });

    it('has an input label postcode - required', () => {
      cy.checkLabel('postcode', 'Postcode(verplicht)');
    });

    it('has an input label straat - required', () => {
      cy.checkLabel('straat', 'Straat(verplicht)');
    });

    it('has an input label huisnummer - required', () => {
      cy.checkLabel('huisnummer', 'Huisnummer(verplicht)');
    });
  });
});
