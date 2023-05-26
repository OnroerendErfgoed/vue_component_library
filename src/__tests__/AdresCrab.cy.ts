import { mount } from 'cypress/vue';
import { defineComponent } from 'vue';
import AdresCrab from '@components/smart/AdresCrab.vue';
import type { IAdresCrabConfig } from '@models/adres-crab';

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
      getLabel('land').should('have.text', 'Land(verplicht)');
    });

    it('has an input label gemeente - required', () => {
      getLabel('gemeente').should('have.text', 'Gemeente(verplicht)');
    });

    it('has an input label postcode - required', () => {
      getLabel('postcode').should('have.text', 'Postcode(verplicht)');
    });

    it('has an input label straat - required', () => {
      getLabel('straat').should('have.text', 'Straat(verplicht)');
    });

    it('has an input label huisnummer', () => {
      getLabel('huisnummer').should('have.text', 'Huisnummer');
    });

    it('has an input label busnummer', () => {
      getLabel('busnummer').should('have.text', 'Busnummer');
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
        setMultiSelectValue('gemeente', 'Bertem');

        getMultiSelect('gemeente').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('postcode').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('straat').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('huisnummer').should('have.class', 'multiselect--disabled');
        getMultiSelect('busnummer').should('have.class', 'multiselect--disabled');

        // Straat selection
        setMultiSelectValue('straat', 'Dorpstraat');

        getMultiSelect('gemeente').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('postcode').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('straat').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('huisnummer').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('busnummer').should('have.class', 'multiselect--disabled');

        // Huisnummer selection
        setMultiSelectValue('huisnummer', '416');

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

      it('resets huisnummers when street fetch throws a 404', () => {
        fillInAdresCrabBelgium();

        cy.intercept('GET', 'https://dev-geo.onroerenderfgoed.be/adressenregister/straten/**/adressen', {
          statusCode: 404,
        }).as('dataNotFound');

        setMultiSelectValue('gemeente', 'Aarschot');
        setMultiSelectValue('straat', 'Beekweg');

        getMultiSelect('huisnummer').click();

        cy.get('[data-cy="no-options-huisnummers"]').should('be.visible');
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
        setMultiSelectValue('gemeente', 'Edingen');
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
        setMultiSelectValue('gemeente', 'Durbuy');
        getMultiSelect('gemeente').find('.multiselect__single').should('have.text', 'Durbuy');

        // Straat selection
        setMultiSelectValue('straat', 'Champoutre');
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
          setMultiSelectValue('gemeente', 'Bertem');
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

    describe('country selection other', () => {
      it('fills in the form', () => {
        fillInAdresCrabOther();
      });

      it('clears the form when changing country', () => {
        fillInAdresCrabOther();

        getMultiSelect('land').select(3);

        getTextInput('gemeente').should('have.text', '');
        getTextInput('postcode').should('have.text', '');
        getTextInput('straat').should('have.text', '');
        getTextInput('huisnummer').should('have.text', '');
        getTextInput('busnummer').should('have.text', '');
      });

      it('triggers required validation after fields are touched and emptied', () => {
        fillInAdresCrabOther();

        getMultiSelect('land').select(3);

        getTextInput('gemeente').should('have.class', 'vl-input-field--error');
        getFormError('gemeente').should('have.text', 'Het veld gemeente is verplicht.');

        getTextInput('postcode').should('have.class', 'vl-input-field--error');
        getFormError('postcode').should('have.text', 'Het veld postcode is verplicht.');

        getTextInput('straat').should('have.class', 'vl-input-field--error');
        getFormError('straat').should('have.text', 'Het veld straat is verplicht.');

        getTextInput('huisnummer').should('not.have.class', 'vl-input-field--error');
        getFormError('huisnummer').should('not.exist');

        getTextInput('busnummer').should('not.have.class', 'vl-input-field--error');
        getFormError('busnummer').should('not.exist');
      });
    });
  });

  describe('form - 2-way binding', () => {
    it('fills in the predefined values', () => {
      mount(TestComponent, {
        data: () => ({
          adres: {
            land: 'BE',
            gemeente: {
              naam: 'Bertem',
              niscode: '24009',
            },
            postcode: {
              nummer: '3060',
            },
            straat: {
              naam: 'Dorpstraat',
              id: '32110',
            },
            adres: {
              huisnummer: '416',
              busnummer: '0101',
            },
          },
        }),
        template: '<Suspense><AdresCrab v-model:adres="adres"/></Suspense>',
      });

      getMultiSelect('land').should('have.value', 'BE');
      getMultiSelect('gemeente').find('.multiselect__single').should('have.text', 'Bertem');
      getMultiSelect('postcode').find('.multiselect__single').should('have.text', '3060');
      getMultiSelect('straat').find('.multiselect__single').should('have.text', 'Dorpstraat');
      getMultiSelect('huisnummer').find('.multiselect__single').should('have.text', '416');
      getMultiSelect('busnummer').find('.multiselect__single').should('have.text', '0101');
    });

    it('updates the model binding on value change', () => {
      mount(TestComponent, {
        data: () => ({
          adres: {
            land: 'BE',
            gemeente: {
              naam: 'Bertem',
              niscode: '24009',
            },
            postcode: {
              nummer: '3060',
            },
            straat: {
              naam: 'Dorpstraat',
              id: '32110',
            },
            adres: {
              huisnummer: '416',
              busnummer: '0101',
            },
          },
        }),
        template: '<Suspense><AdresCrab v-model:adres="adres"/></Suspense>',
      }).then(({ component }) => {
        getMultiSelect('gemeente').click();
        getMultiSelect('gemeente').find('.multiselect__input').type('Lummen');
        getMultiSelect('gemeente')
          .find('.multiselect__element')
          .click()
          .then(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((component.$data as any).adres).to.deep.equal({
              land: 'BE',
              gemeente: {
                naam: 'Lummen',
                niscode: '71037',
              },
              postcode: {
                nummer: '',
              },
              straat: {
                naam: '',
              },
              adres: {
                huisnummer: '',
                busnummer: '',
              },
            });
          });
      });
    });
  });

  describe('form - custom API', () => {
    it('addresses the network call to the given API', () => {
      const api = 'https://test.be';
      cy.intercept(`${api}/adressenregister/landen`, {}).as('dataGetLanden');

      mount(TestComponent, {
        data: () => ({ api }),
        template: '<Suspense><AdresCrab :api="api"/></Suspense>',
      }).then(() => {
        cy.wait('@dataGetLanden').then((intercept) => {
          expect(intercept.request.url).to.equal('https://test.be/adressenregister/landen');
        });
      });
    });
  });

  describe('form - custom config', () => {
    describe('applies custom configuration to free-text fields - land and gemeente required', () => {
      const config: IAdresCrabConfig = {
        land: {
          required: true,
        },
        gemeente: {
          required: true,
        },
        postcode: {
          required: false,
        },
        straat: {
          required: false,
        },
        huisnummer: {
          required: false,
        },
        busnummer: {
          required: false,
        },
      };

      beforeEach(() => {
        mount(TestComponent, {
          data: () => ({ config }),
          template: '<Suspense><AdresCrab :config="config"/></Suspense>',
        });
      });

      it('has an input label land - required', () => {
        getLabel('land').should('have.text', 'Land(verplicht)');
      });

      it('has an input label gemeente - required', () => {
        getLabel('gemeente').should('have.text', 'Gemeente(verplicht)');
      });

      it('has an input label postcode', () => {
        getLabel('postcode').should('have.text', 'Postcode');
      });

      it('has an input label straat', () => {
        getLabel('straat').should('have.text', 'Straat');
      });

      it('has an input label huisnummer', () => {
        getLabel('huisnummer').should('have.text', 'Huisnummer');
      });

      it('has an input label busnummer', () => {
        getLabel('busnummer').should('have.text', 'Busnummer');
      });

      it('triggers required validation after fields are touched and emptied', () => {
        fillInAdresCrabOther();

        getMultiSelect('land').select(3);

        getTextInput('gemeente').should('have.class', 'vl-input-field--error');
        getFormError('gemeente').should('have.text', 'Het veld gemeente is verplicht.');

        getTextInput('postcode').should('not.have.class', 'vl-input-field--error');
        getFormError('postcode').should('not.exist');

        getTextInput('straat').should('not.have.class', 'vl-input-field--error');
        getFormError('straat').should('not.exist');

        getTextInput('huisnummer').should('not.have.class', 'vl-input-field--error');
        getFormError('huisnummer').should('not.exist');

        getTextInput('busnummer').should('not.have.class', 'vl-input-field--error');
        getFormError('busnummer').should('not.exist');
      });
    });

    describe('applies custom configuration to free-text fields - all required', () => {
      const config: IAdresCrabConfig = {
        land: {
          required: true,
        },
        gemeente: {
          required: true,
        },
        postcode: {
          required: true,
        },
        straat: {
          required: true,
        },
        huisnummer: {
          required: true,
        },
        busnummer: {
          required: true,
        },
      };

      beforeEach(() => {
        mount(TestComponent, {
          data: () => ({ config }),
          template: '<Suspense><AdresCrab :config="config"/></Suspense>',
        });
      });

      it('has an input label land - required', () => {
        getLabel('land').should('have.text', 'Land(verplicht)');
      });

      it('has an input label gemeente - required', () => {
        getLabel('gemeente').should('have.text', 'Gemeente(verplicht)');
      });

      it('has an input label postcode', () => {
        getLabel('postcode').should('have.text', 'Postcode(verplicht)');
      });

      it('has an input label straat', () => {
        getLabel('straat').should('have.text', 'Straat(verplicht)');
      });

      it('has an input label huisnummer', () => {
        getLabel('huisnummer').should('have.text', 'Huisnummer(verplicht)');
      });

      it('has an input label busnummer', () => {
        getLabel('busnummer').should('have.text', 'Busnummer(verplicht)');
      });

      it('triggers required validation after fields are touched and emptied', () => {
        fillInAdresCrabOther();

        getMultiSelect('land').select(3);

        getTextInput('gemeente').should('have.class', 'vl-input-field--error');
        getFormError('gemeente').should('have.text', 'Het veld gemeente is verplicht.');

        getTextInput('postcode').should('have.class', 'vl-input-field--error');
        getFormError('postcode').should('have.text', 'Het veld postcode is verplicht.');

        getTextInput('straat').should('have.class', 'vl-input-field--error');
        getFormError('straat').should('have.text', 'Het veld straat is verplicht.');

        getTextInput('huisnummer').should('have.class', 'vl-input-field--error');
        getFormError('huisnummer').should('have.text', 'Het veld huisnummer is verplicht.');

        getTextInput('busnummer').should('have.class', 'vl-input-field--error');
        getFormError('busnummer').should('have.text', 'Het veld busnummer is verplicht.');
      });
    });

    describe('applies custom configuration to multi-select fields - all required', () => {
      const config: IAdresCrabConfig = {
        land: {
          required: true,
        },
        gemeente: {
          required: true,
        },
        postcode: {
          required: true,
        },
        straat: {
          required: true,
        },
        huisnummer: {
          required: true,
        },
        busnummer: {
          required: true,
        },
      };

      beforeEach(() => {
        mount(TestComponent, {
          data: () => ({ config }),
          template: '<Suspense><AdresCrab :config="config"/></Suspense>',
        });
      });

      it('triggers required validation after fields are touched and emptied', () => {
        fillInAdresCrabBelgium();

        getMultiSelect('land').select(3).select(1);

        getMultiSelect('gemeente').parent().should('have.class', 'vl-multiselect--error');
        getFormError('gemeente').should('have.text', 'Het veld gemeente is verplicht.');

        getMultiSelect('postcode').parent().should('have.class', 'vl-multiselect--error');
        getFormError('postcode').should('have.text', 'Het veld postcode is verplicht.');

        getMultiSelect('straat').parent().should('have.class', 'vl-multiselect--error');
        getFormError('straat').should('have.text', 'Het veld straat is verplicht.');

        getMultiSelect('huisnummer').parent().should('have.class', 'vl-multiselect--error');
        getFormError('huisnummer').should('have.text', 'Het veld huisnummer is verplicht.');

        getMultiSelect('busnummer').parent().should('have.class', 'vl-multiselect--error');
        getFormError('busnummer').should('have.text', 'Het veld busnummer is verplicht.');
      });
    });
  });

  describe('form - specific country', () => {
    beforeEach(() => {
      mount(TestComponent, {
        template: '<Suspense><AdresCrab countryId="BE" v-model:adres="adres"/></Suspense>',
      });
    });

    it('does not render the land entry', () => {
      getLabel('land').should('not.exist');
      getMultiSelect('land').should('not.exist');

      getMultiSelect('gemeente').should('exist');
      getMultiSelect('postcode').should('exist');
      getMultiSelect('straat').should('exist');
      getMultiSelect('huisnummer').should('exist');
      getMultiSelect('busnummer').should('exist');
    });
  });

  describe('form - multi select options limit', () => {
    beforeEach(() => {
      mount(TestComponent, {
        template: '<Suspense><AdresCrab :options-limit="3" v-model:adres="adres"/></Suspense>',
      });
    });
    it('sets the max amount of items at multi-select elements', () => {
      getMultiSelect('land').select(1).should('have.value', 'BE');

      cy.intercept({ method: 'GET', url: 'https://dev-geo.onroerenderfgoed.be/**' }).as('dataGet');
      cy.wait('@dataGet');

      getMultiSelect('gemeente').click();
      getMultiSelect('gemeente').find('.multiselect__element').should('have.length', 3);

      getMultiSelect('gemeente').find('.multiselect__input').type('Aalst');
      getMultiSelect('gemeente').find('.multiselect__element').click();
      getMultiSelect('postcode').click();
      getMultiSelect('postcode').find('.multiselect__element').should('have.length', 3);

      getMultiSelect('postcode').find('.multiselect__input').type('9300');
      getMultiSelect('postcode').find('.multiselect__element').click();
      getMultiSelect('straat').click();
      getMultiSelect('straat').find('.multiselect__element').should('have.length', 3);
    });
  });
});

const getLabel = (field: string) => cy.get(`[data-cy="label-${field}"]`);
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
  setMultiSelectValue('gemeente', 'Bertem');
  getMultiSelect('gemeente').find('.multiselect__single').should('have.text', 'Bertem');

  // Postcode selection
  setMultiSelectValue('postcode', '3060');
  getMultiSelect('postcode').find('.multiselect__single').should('have.text', '3060');

  cy.wait('@dataGet');

  // Straat selection
  setMultiSelectValue('straat', 'Dorpstraat');
  getMultiSelect('straat').find('.multiselect__single').should('have.text', 'Dorpstraat');

  cy.wait('@dataGet');

  // Huisnummer with multiple busnummers
  setMultiSelectValue('huisnummer', '416');
  getMultiSelect('huisnummer').find('.multiselect__single').should('have.text', '416');

  cy.wait('@dataGet');

  // Busnummer selection
  setMultiSelectValue('busnummer', '0101');
  getMultiSelect('busnummer').find('.multiselect__single').should('have.text', '0101');
};

const fillInAdresCrabOther = () => {
  // Country selection
  getMultiSelect('land').select(2).should('have.value', 'DE');

  // Gemeente input
  getTextInput('gemeente').type('Koln');
  getTextInput('postcode').type('50667');
  getTextInput('straat').type('Beuelsweg');
  getTextInput('huisnummer').type('33');
  getTextInput('busnummer').type('B3');
};

const setMultiSelectValue = (field: string, value: string) => {
  getMultiSelect(field).click();
  getMultiSelect(field).find('.multiselect__input').type(value);
  getMultiSelect(field).find('.multiselect__element').click();
};
