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

    describe('country selection België', () => {
      it('fills in the form with a single busnummer', () => {
        fillInAdresCrabBelgium();
      });

      it('fills in the form with multiple busnummers', () => {
        fillInAdresCrabBelgium(true);
      });

      it('clears the form when changing country', () => {
        fillInAdresCrabBelgium(true);

        cy.get('[data-cy="select-land"]').select(2).select(1);

        getMultiSelect('gemeente').find('.multiselect__single').should('not.exist');
        getMultiSelect('postcode').find('.multiselect__single').should('not.exist');
        getMultiSelect('straat').find('.multiselect__single').should('not.exist');
        getMultiSelect('huisnummer').find('.multiselect__single').should('not.exist');
      });

      // it('triggers required validation after fields are touched and emptied', () => {
      //   fillInAdresCrabBelgium(true);

      //   cy.get('[data-cy="select-land"]').select(2).select(1);
      // });
    });
  });
});

const getMultiSelect = (field: string) => cy.get(`[data-cy="select-${field}"]`);
const getTextInput = (field: string) => cy.get(`[data-cy="input-${field}"]`);

const fillInAdresCrabBelgium = (withMultipleBusnummers = false) => {
  // Country selection
  cy.get('[data-cy="select-land"]').select(1).should('have.value', 'BE');

  cy.intercept({ method: 'GET', url: 'https://dev-geo.onroerenderfgoed.be/**' }).as('dataGet');
  cy.wait('@dataGet');

  // Gemeente selection
  cy.get('[data-cy="select-gemeente"]').click();
  cy.get('[data-cy="select-gemeente"] .multiselect__input').type('Bertem');
  cy.get('[data-cy="select-gemeente"] .multiselect__element').click();
  cy.get('[data-cy="select-gemeente"] .multiselect__single').should('have.text', 'Bertem');

  // Postcode selection
  cy.get('[data-cy="select-postcode"]').click();
  cy.get('[data-cy="select-postcode"] .multiselect__input').type('3060');
  cy.get('[data-cy="select-postcode"] .multiselect__element').click();
  cy.get('[data-cy="select-postcode"] .multiselect__single').should('have.text', '3060');

  cy.wait('@dataGet');

  // Straat selection
  cy.get('[data-cy="select-straat"]').click();
  cy.get('[data-cy="select-straat"] .multiselect__input').type('Dorpstraat');
  cy.get('[data-cy="select-straat"] .multiselect__element').click();
  cy.get('[data-cy="select-straat"] .multiselect__single').should('have.text', 'Dorpstraat');

  cy.wait('@dataGet');

  if (withMultipleBusnummers) {
    // Huisnummer with multiple busnummers
    cy.get('[data-cy="select-huisnummer"]').click();
    cy.get('[data-cy="select-huisnummer"] .multiselect__input').type('416');
    cy.get('[data-cy="select-huisnummer"] .multiselect__element').first().click();
    cy.get('[data-cy="select-huisnummer"] .multiselect__single').should('have.text', '416');
    cy.get('[data-cy="select-busnummer"]').should('exist');

    cy.wait('@dataGet');

    // Busnummer selection
    cy.get('[data-cy="select-busnummer"]').click();
    cy.get('[data-cy="select-busnummer"] .multiselect__input').type('0101');
    cy.get('[data-cy="select-busnummer"] .multiselect__element').first().click();
    cy.get('[data-cy="select-busnummer"] .multiselect__single').should('have.text', '0101');
  } else {
    // Huisnummer selection
    cy.get('[data-cy="select-huisnummer"]').click();
    cy.get('[data-cy="select-huisnummer"] .multiselect__input').type('3');
    cy.get('[data-cy="select-huisnummer"] .multiselect__element').first().click();
    cy.get('[data-cy="select-huisnummer"] .multiselect__single').should('have.text', '3');
    cy.get('[data-cy="select-busnummer"]').should('not.exist');
  }
};
