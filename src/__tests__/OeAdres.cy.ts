import { mount } from 'cypress/vue';
import { defineComponent, useAttrs } from 'vue';
import OeAdres from '@components/smart/OeAdres.vue';
import type { IAdresConfig } from '@models/adres';

describe('Adres', () => {
  const TestComponent = defineComponent({
    components: { OeAdres },
    setup() {
      const attrs = useAttrs();
      return { attrs };
    },
    template: '<Suspense><OeAdres v-bind="attrs"/></Suspense>',
  });

  it('renders', () => {
    mount(TestComponent);
  });

  it('has a title adres', () => {
    mount(TestComponent);
    cy.dataCy('title-adres').should('have.text', 'Adres');
  });

  describe('form - default', () => {
    beforeEach(() => {
      mount(TestComponent);
    });

    it('has an input label land', () => {
      getLabel('land').should('have.text', 'Land');
    });

    it('has an input label gemeente', () => {
      getLabel('gemeente').should('have.text', 'Gemeente');
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

    describe('country selection België', () => {
      it('disables fields when country select is empty', () => {
        getMultiSelect('gemeente').should('have.class', 'multiselect--disabled');
        getMultiSelect('postcode').should('have.class', 'multiselect--disabled');
        getMultiSelect('straat').should('have.class', 'multiselect--disabled');
        getAutocomplete('huisnummer').should('have.class', 'vl-input-field--disabled');
        getAutocomplete('busnummer').should('have.class', 'vl-input-field--disabled');
      });

      it('disables fields as long as the parent is not filled in', () => {
        // Country selection
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');
        cy.intercept({ method: 'GET', url: 'https://test-geo.onroerenderfgoed.be/**' }).as('dataGet');
        cy.wait('@dataGet');

        getMultiSelect('gemeente').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('postcode').should('have.class', 'multiselect--disabled');
        getMultiSelect('straat').should('have.class', 'multiselect--disabled');
        getAutocomplete('huisnummer').should('have.class', 'vl-input-field--disabled');
        getAutocomplete('busnummer').should('have.class', 'vl-input-field--disabled');

        // Gemeente selection
        setMultiSelectValue('gemeente', 'Bertem');

        getMultiSelect('gemeente').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('postcode').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('straat').should('not.have.class', 'multiselect--disabled');
        getAutocomplete('huisnummer').should('have.class', 'vl-input-field--disabled');
        getAutocomplete('busnummer').should('have.class', 'vl-input-field--disabled');

        // Straat selection
        setMultiSelectValue('straat', 'Dorpstraat');

        getMultiSelect('gemeente').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('postcode').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('straat').should('not.have.class', 'multiselect--disabled');
        getAutocomplete('huisnummer').should('not.have.class', 'vl-input-field--disabled');
        getAutocomplete('busnummer').should('have.class', 'vl-input-field--disabled');

        // Huisnummer selection
        setAutocompleteValue('huisnummer', '416');

        getMultiSelect('gemeente').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('postcode').should('not.have.class', 'multiselect--disabled');
        getMultiSelect('straat').should('not.have.class', 'multiselect--disabled');
        getAutocomplete('huisnummer').should('not.have.class', 'vl-input-field--disabled');
        getAutocomplete('busnummer').should('not.have.class', 'vl-input-field--disabled');
      });

      it('fills in the form', () => {
        fillInOeAdresBelgium();
      });

      it('clears the form when changing country', () => {
        fillInOeAdresBelgium();

        getMultiSelect('land').select(2).select(1);

        getMultiSelect('gemeente').find('.multiselect__single').should('not.exist');
        getMultiSelect('postcode').find('.multiselect__single').should('not.exist');
        getMultiSelect('straat').find('.multiselect__single').should('not.exist');
        getAutocomplete('huisnummer').find('.multiselect__single').should('not.exist');
        getAutocomplete('huisnummer').find('.multiselect__single').should('not.exist');
      });

      it('triggers required validation after fields are touched and emptied', () => {
        fillInOeAdresBelgium();

        getMultiSelect('land').select(2).select(1);

        getMultiSelect('gemeente').parent().should('have.class', 'vl-multiselect--error');
        getFormError('gemeente').should('have.text', 'Het veld gemeente is verplicht.');

        getMultiSelect('postcode').parent().should('have.class', 'vl-multiselect--error');
        getFormError('postcode').should('have.text', 'Het veld postcode is verplicht.');

        getMultiSelect('straat').parent().should('have.class', 'vl-multiselect--error');
        getFormError('straat').should('have.text', 'Het veld straat is verplicht.');

        getAutocomplete('huisnummer').should('have.class', 'vl-input-field--error');
        getFormError('huisnummer').should('have.text', 'Het veld huisnummer is verplicht.');

        getAutocomplete('busnummer').should('not.have.class', 'vl-input-field--error');
        getFormError('busnummer').should('not.exist');
      });

      it('requires straat to be free text input when no streets were found', () => {
        // Country selection
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');

        cy.intercept({ method: 'GET', url: 'https://test-geo.onroerenderfgoed.be/**' }).as('dataGet');
        cy.wait('@dataGet');

        // Gemeente selection
        setMultiSelectValue('gemeente', 'Edingen');
        getMultiSelect('gemeente').find('.multiselect__single').should('have.text', 'Edingen');

        getMultiSelect('straat').should('not.exist');
        getTextInput('straat').should('exist');
      });

      it('allows huisnummer to be free text input when no house numbers were found', () => {
        // Country selection
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');

        cy.intercept({ method: 'GET', url: 'https://test-geo.onroerenderfgoed.be/**' }).as('dataGet');
        cy.wait('@dataGet');

        // Gemeente selection
        setMultiSelectValue('gemeente', 'Durbuy');
        getMultiSelect('gemeente').find('.multiselect__single').should('have.text', 'Durbuy');

        // Straat selection
        setMultiSelectValue('straat', 'Champoutre');
        getMultiSelect('straat').find('.multiselect__single').should('have.text', 'Champoutre');

        getTextInput('huisnummer').should('exist');
      });

      it('requires busnummer to be free text input when no house numbers were found', () => {
        // Country selection
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');

        cy.intercept({ method: 'GET', url: 'https://test-geo.onroerenderfgoed.be/**' }).as('dataGet');
        cy.wait('@dataGet');

        // Gemeente selection
        setMultiSelectValue('gemeente', 'Aarschot');
        getMultiSelect('gemeente').find('.multiselect__single').should('have.text', 'Aarschot');

        // Straat selection
        setMultiSelectValue('straat', 'Astridlaan');
        getMultiSelect('straat').find('.multiselect__single').should('have.text', 'Astridlaan');

        // Huisnummer selection
        setAutocompleteValue('huisnummer', '28');
        getAutocomplete('huisnummer').should('have.value', '28');

        getTextInput('busnummer').should('exist');
      });
    });

    describe('country selection other', () => {
      it('fills in the form', () => {
        fillInOeAdresOther();
      });

      it('clears the form when changing country', () => {
        fillInOeAdresOther();

        getMultiSelect('land').select(3);

        getTextInput('gemeente').should('have.text', '');
        getTextInput('postcode').should('have.text', '');
        getTextInput('straat').should('have.text', '');
        getTextInput('huisnummer').should('have.text', '');
        getTextInput('busnummer').should('have.text', '');
      });

      it('triggers required validation after fields are touched and emptied', () => {
        fillInOeAdresOther();

        getMultiSelect('land').select(3);

        getTextInput('gemeente').should('have.class', 'vl-input-field--error');
        getFormError('gemeente').should('have.text', 'Het veld gemeente is verplicht.');

        getTextInput('postcode').should('have.class', 'vl-input-field--error');
        getFormError('postcode').should('have.text', 'Het veld postcode is verplicht.');

        getTextInput('straat').should('have.class', 'vl-input-field--error');
        getFormError('straat').should('have.text', 'Het veld straat is verplicht.');

        getTextInput('huisnummer').should('have.class', 'vl-input-field--error');
        getFormError('huisnummer').should('have.text', 'Het veld huisnummer is verplicht.');

        getTextInput('busnummer').should('not.have.class', 'vl-input-field--error');
        getFormError('busnummer').should('not.exist');
      });
    });
  });

  describe('form - show required annotation per field', () => {
    beforeEach(() => {
      mount(TestComponent, { props: { showRequiredPerField: true } });
    });

    it('has an input label land', () => {
      getLabel('land').should('have.text', 'LandVERPLICHT');
    });

    it('has an input label gemeente', () => {
      getLabel('gemeente').should('have.text', 'GemeenteVERPLICHT');
    });

    it('has an input label postcode', () => {
      getLabel('postcode').should('have.text', 'PostcodeVERPLICHT');
    });

    it('has an input label straat', () => {
      getLabel('straat').should('have.text', 'StraatVERPLICHT');
    });

    it('has an input label huisnummer', () => {
      getLabel('huisnummer').should('have.text', 'HuisnummerVERPLICHT');
    });

    it('has an input label busnummer', () => {
      getLabel('busnummer').should('have.text', 'Busnummer');
    });
  });

  describe('form - 2-way binding', () => {
    it('fills in the predefined values', () => {
      mount(TestComponent, {
        data: () => ({
          adres: {
            land: {
              naam: 'België',
              code: 'BE',
            },
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
        template: '<Suspense><OeAdres v-model:adres="adres"/></Suspense>',
      });

      getMultiSelect('land').find(':selected').should('have.text', 'België');
      getMultiSelect('gemeente').find('.multiselect__single').should('have.text', 'Bertem');
      getMultiSelect('postcode').find('.multiselect__single').should('have.text', '3060');
      getMultiSelect('straat').find('.multiselect__single').should('have.text', 'Dorpstraat');
      getAutocomplete('huisnummer').should('have.value', '416');
      getAutocomplete('busnummer').should('have.value', '0101');
    });

    it('updates the model binding on value change', () => {
      mount(TestComponent, {
        data: () => ({
          adres: {
            land: {
              naam: 'België',
              code: 'BE',
            },
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
        template: '<Suspense><OeAdres v-model:adres="adres"/></Suspense>',
      }).then(({ component }) => {
        getMultiSelect('gemeente').click();
        getMultiSelect('gemeente').find('.multiselect__input').type('Lummen');
        getMultiSelect('gemeente')
          .find('.multiselect__element')
          .click()
          .then(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((component.$data as any).adres).to.deep.equal({
              land: {
                naam: 'België',
                code: 'BE',
              },
              gemeente: {
                naam: 'Lummen',
                niscode: '71037',
              },
              postcode: {},
              straat: {},
              adres: {},
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
        template: '<Suspense><OeAdres :api="api"/></Suspense>',
      }).then(() => {
        cy.wait('@dataGetLanden').then((intercept) => {
          expect(intercept.request.url).to.equal('https://test.be/adressenregister/landen');
        });
      });
    });
  });

  describe('form - custom config', () => {
    describe('applies custom configuration to free-text fields - land and gemeente required', () => {
      const config: IAdresConfig = {
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
          template: '<Suspense><OeAdres :config="config"/></Suspense>',
        });
      });

      it('has an input label land', () => {
        getLabel('land').should('have.text', 'Land');
      });

      it('has an input label gemeente', () => {
        getLabel('gemeente').should('have.text', 'Gemeente');
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
        fillInOeAdresOther();

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
      const config: IAdresConfig = {
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
          template: '<Suspense><OeAdres :config="config"/></Suspense>',
        });
      });

      it('has an input label land', () => {
        getLabel('land').should('have.text', 'Land');
      });

      it('has an input label gemeente', () => {
        getLabel('gemeente').should('have.text', 'Gemeente');
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
        fillInOeAdresOther();

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
      const config: IAdresConfig = {
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
          template: '<Suspense><OeAdres :config="config"/></Suspense>',
        });
      });

      it('triggers required validation after fields are touched and emptied', () => {
        fillInOeAdresBelgium();

        getMultiSelect('land').select(3).select(1);

        getMultiSelect('gemeente').parent().should('have.class', 'vl-multiselect--error');
        getFormError('gemeente').should('have.text', 'Het veld gemeente is verplicht.');

        getMultiSelect('postcode').parent().should('have.class', 'vl-multiselect--error');
        getFormError('postcode').should('have.text', 'Het veld postcode is verplicht.');

        getMultiSelect('straat').parent().should('have.class', 'vl-multiselect--error');
        getFormError('straat').should('have.text', 'Het veld straat is verplicht.');

        getAutocomplete('huisnummer').should('have.class', 'vl-input-field--error');
        getFormError('huisnummer').should('have.text', 'Het veld huisnummer is verplicht.');

        getAutocomplete('busnummer').should('have.class', 'vl-input-field--error');
        getFormError('busnummer').should('have.text', 'Het veld busnummer is verplicht.');
      });
    });
  });

  describe('form - specific country', () => {
    beforeEach(() => {
      mount(TestComponent, {
        template: '<Suspense><OeAdres countryId="BE" v-model:adres="adres"/></Suspense>',
      });
    });

    it('does not render the land entry', () => {
      getLabel('land').should('not.exist');
      getMultiSelect('land').should('not.exist');

      getMultiSelect('gemeente').should('exist');
      getMultiSelect('postcode').should('exist');
      getMultiSelect('straat').should('exist');
      getAutocomplete('huisnummer').should('exist');
      getAutocomplete('busnummer').should('exist');
    });
  });

  describe('form - multi select options limit', () => {
    beforeEach(() => {
      mount(TestComponent, {
        template: '<Suspense><OeAdres :options-limit="3" v-model:adres="adres"/></Suspense>',
      });
    });
    it('sets the max amount of items at multi-select elements', () => {
      getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');

      cy.intercept({ method: 'GET', url: 'https://test-geo.onroerenderfgoed.be/**' }).as('dataGet');
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

const getLabel = (field: string) => cy.dataCy(`label-${field}`);
const getMultiSelect = (field: string) => cy.dataCy(`select-${field}`);
const getAutocomplete = (field: string) => cy.dataCy(`autocomplete-${field}`).children().first();
const getTextInput = (field: string) => cy.dataCy(`input-${field}`);
const getFormError = (field: string) => cy.dataCy(`form-error-${field}`);

const fillInOeAdresBelgium = () => {
  // Country selection
  getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');

  cy.intercept({ method: 'GET', url: 'https://test-geo.onroerenderfgoed.be/**' }).as('dataGet');
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
  setAutocompleteValue('huisnummer', '416').then(() => {
    getAutocomplete('huisnummer').should('have.value', '416');
  });

  cy.wait('@dataGet');

  // Busnummer selection
  setAutocompleteValue('busnummer', '010').then(() => {
    getAutocomplete('busnummer').should('have.value', '0101');
  });
};

const fillInOeAdresOther = () => {
  // Country selection
  getMultiSelect('land').select(2).find(':selected').should('have.text', 'Duitsland');

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

const setAutocompleteValue = (field: string, value: string) => {
  getAutocomplete(field).click();
  return getAutocomplete(field).type(value);
};
