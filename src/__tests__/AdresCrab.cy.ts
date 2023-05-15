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

    it('has an input label huisnummer', () => {
      cy.checkLabel('huisnummer', 'Huisnummer');
    });

    it('has an input label busnummer', () => {
      cy.checkLabel('busnummer', 'Busnummer');
    });

    describe('country selection België', () => {
      it('disables fields as long as the parent is not filled in', () => {
        getMultiSelect('gemeente').should('have.class', 'multiselect--disabled');
        getMultiSelect('postcode').should('have.class', 'multiselect--disabled');
        getMultiSelect('straat').should('have.class', 'multiselect--disabled');
        getMultiSelect('huisnummer').should('have.class', 'multiselect--disabled');
        getMultiSelect('busnummer').should('have.class', 'multiselect--disabled');

        // Country selection
        getMultiSelect('land').select(1).should('have.value', 'BE');

        cy.intercept({ method: 'GET', url: 'https://dev-geo.onroerenderfgoed.be/**' }).as('dataGet');
        cy.wait('@dataGet');

        getMultiSelect('gemeente').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('postcode').should('have.class', 'multiselect--disabled');
        getMultiSelect('straat').should('have.class', 'multiselect--disabled');
        getMultiSelect('huisnummer').should('have.class', 'multiselect--disabled');
        getMultiSelect('busnummer').should('have.class', 'multiselect--disabled');

        // Gemeente selection
        getMultiSelect('gemeente').click();
        getMultiSelect('gemeente').find('.multiselect__input').type('Bertem');
        getMultiSelect('gemeente').find('.multiselect__element').click();

        getMultiSelect('gemeente').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('postcode').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('straat').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('huisnummer').should('have.class', 'multiselect--disabled');
        getMultiSelect('busnummer').should('have.class', 'multiselect--disabled');

        // Straat selection
        getMultiSelect('straat').click();
        getMultiSelect('straat').find('.multiselect__input').type('Dorpstraat');
        getMultiSelect('straat').find('.multiselect__element').click();

        getMultiSelect('gemeente').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('postcode').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('straat').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('huisnummer').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('busnummer').should('have.class', 'multiselect--disabled');

        // Huisnummer selection
        getMultiSelect('huisnummer').click();
        getMultiSelect('huisnummer').find('.multiselect__input').type('416');
        getMultiSelect('huisnummer').find('.multiselect__element').first().click();

        getMultiSelect('gemeente').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('postcode').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('straat').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('huisnummer').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('busnummer').should('not.have.class', 'multiselect--disabled');
      });

      it('fills in the form', () => {
        fillInAdresCrabBelgium();
      });

      it('clears the form when changing country', () => {
        fillInAdresCrabBelgium();

        getMultiSelect('land').select(2).select(1);

        getMultiSelect('gemeente').find('.multiselect__single').should('not.exist');
        getMultiSelect('postcode').find('.multiselect__single').should('not.exist');
        getMultiSelect('straat').find('.multiselect__single').should('not.exist');
        getMultiSelect('huisnummer').find('.multiselect__single').should('not.exist');
        getMultiSelect('huisnummer').find('.multiselect__single').should('not.exist');
      });

      it('triggers required validation after fields are touched and emptied', () => {
        fillInAdresCrabBelgium();

        getMultiSelect('land').select(2).select(1);

        getMultiSelect('gemeente').parent().should('have.class', 'vl-multiselect--error');
        getFormError('gemeente').should('have.text', 'Het veld gemeente is verplicht.');

        getMultiSelect('postcode').parent().should('have.class', 'vl-multiselect--error');
        getFormError('postcode').should('have.text', 'Het veld postcode is verplicht.');

        getMultiSelect('straat').parent().should('have.class', 'vl-multiselect--error');
        getFormError('straat').should('have.text', 'Het veld straat is verplicht.');

        getMultiSelect('huisnummer').parent().should('not.have.class', 'vl-multiselect--error');
        getFormError('huisnummer').should('not.exist');

        getMultiSelect('busnummer').parent().should('not.have.class', 'vl-multiselect--error');
        getFormError('busnummer').should('not.exist');
      });

      it('requires straat to be free text input when no streets were found', () => {
        // Country selection
        getMultiSelect('land').select(1).should('have.value', 'BE');

        cy.intercept({ method: 'GET', url: 'https://dev-geo.onroerenderfgoed.be/**' }).as('dataGet');
        cy.wait('@dataGet');

        // Gemeente selection
        getMultiSelect('gemeente').click();
        getMultiSelect('gemeente').find('.multiselect__input').type('Edingen');
        getMultiSelect('gemeente').find('.multiselect__element').click();
        getMultiSelect('gemeente').find('.multiselect__single').should('have.text', 'Edingen');

        getMultiSelect('straat').should('not.exist');
        getTextInput('straat').should('exist');
      });

      it('requires huisnummer to be free text input when no house numbers were found', () => {
        // Country selection
        getMultiSelect('land').select(1).should('have.value', 'BE');

        cy.intercept({ method: 'GET', url: 'https://dev-geo.onroerenderfgoed.be/**' }).as('dataGet');
        cy.wait('@dataGet');

        // Gemeente selection
        getMultiSelect('gemeente').click();
        getMultiSelect('gemeente').find('.multiselect__input').type('Durbuy');
        getMultiSelect('gemeente').find('.multiselect__element').click();
        getMultiSelect('gemeente').find('.multiselect__single').should('have.text', 'Durbuy');

        // Straat selection
        getMultiSelect('straat').click();
        getMultiSelect('straat').find('.multiselect__input').type('Champoutre');
        getMultiSelect('straat').find('.multiselect__element').click();
        getMultiSelect('straat').find('.multiselect__single').should('have.text', 'Champoutre');

        getMultiSelect('huisnummer').should('not.exist');
        getTextInput('huisnummer').should('exist');
      });

      describe('after gemeente selection', () => {
        beforeEach(() => {
          // Country selection
          getMultiSelect('land').select(1).should('have.value', 'BE');

          cy.intercept({ method: 'GET', url: 'https://dev-geo.onroerenderfgoed.be/**' }).as('dataGet');
          cy.wait('@dataGet');

          // Gemeente selection
          getMultiSelect('gemeente').click();
          getMultiSelect('gemeente').find('.multiselect__input').type('Bertem');
          getMultiSelect('gemeente').find('.multiselect__element').click();
          getMultiSelect('gemeente').find('.multiselect__single').should('have.text', 'Bertem');
        });

        it('allows to switch huisnummer to free text input and automatically convert busnummer to free text as well', () => {
          // Switch to free text input
          getAction('huisnummer-not-found').should('have.text', 'Huisnummer niet gevonden?');
          getAction('huisnummer-not-found').click();

          getMultiSelect('huisnummer').should('not.exist');
          getTextInput('huisnummer').should('exist');
          getAction('huisnummer-not-found').should('have.text', 'Suggesties');

          getMultiSelect('busnummer').should('not.exist');
          getTextInput('busnummer').should('exist');
          getAction('busnummer-not-found').should('not.exist');

          // Switch back to suggestions
          getAction('huisnummer-not-found').click();

          getMultiSelect('huisnummer').should('exist');
          getTextInput('huisnummer').should('not.exist');
          getAction('huisnummer-not-found').should('have.text', 'Huisnummer niet gevonden?');
        });

        it('allows to switch busnummer to free text input', () => {
          // Switch to free text input
          getAction('busnummer-not-found').should('have.text', 'Busnummer niet gevonden?');
          getAction('busnummer-not-found').click();

          getMultiSelect('busnummer').should('not.exist');
          getTextInput('busnummer').should('exist');
          getAction('busnummer-not-found').should('have.text', 'Suggesties');

          // Switch back to suggestions
          getAction('busnummer-not-found').click();

          getMultiSelect('busnummer').should('exist');
          getTextInput('busnummer').should('not.exist');
          getAction('busnummer-not-found').should('have.text', 'Busnummer niet gevonden?');
        });
      });
    });
  });
});

const getMultiSelect = (field: string) => cy.get(`[data-cy="select-${field}"]`);
const getTextInput = (field: string) => cy.get(`[data-cy="input-${field}"]`);
const getFormError = (field: string) => cy.get(`[data-cy="form-error-${field}"]`);
const getAction = (action: string) => cy.get(`[data-cy="action-${action}"]`);

const fillInAdresCrabBelgium = () => {
  // Country selection
  getMultiSelect('land').select(1).should('have.value', 'BE');

  cy.intercept({ method: 'GET', url: 'https://dev-geo.onroerenderfgoed.be/**' }).as('dataGet');
  cy.wait('@dataGet');

  // Gemeente selection
  getMultiSelect('gemeente').click();
  getMultiSelect('gemeente').find('.multiselect__input').type('Bertem');
  getMultiSelect('gemeente').find('.multiselect__element').click();
  getMultiSelect('gemeente').find('.multiselect__single').should('have.text', 'Bertem');

  // Postcode selection
  getMultiSelect('postcode').click();
  getMultiSelect('postcode').find('.multiselect__input').type('3060');
  getMultiSelect('postcode').find('.multiselect__element').click();
  getMultiSelect('postcode').find('.multiselect__single').should('have.text', '3060');

  cy.wait('@dataGet');

  // Straat selection
  getMultiSelect('straat').click();
  getMultiSelect('straat').find('.multiselect__input').type('Dorpstraat');
  getMultiSelect('straat').find('.multiselect__element').click();
  getMultiSelect('straat').find('.multiselect__single').should('have.text', 'Dorpstraat');

  cy.wait('@dataGet');

  // Huisnummer with multiple busnummers
  getMultiSelect('huisnummer').click();
  getMultiSelect('huisnummer').find('.multiselect__input').type('416');
  getMultiSelect('huisnummer').find('.multiselect__element').first().click();
  getMultiSelect('huisnummer').find('.multiselect__single').should('have.text', '416');

  cy.wait('@dataGet');

  // Busnummer selection
  getMultiSelect('busnummer').click();
  getMultiSelect('busnummer').find('.multiselect__input').type('0101');
  getMultiSelect('busnummer').find('.multiselect__element').first().click();
  getMultiSelect('busnummer').find('.multiselect__single').should('have.text', '0101');
};
