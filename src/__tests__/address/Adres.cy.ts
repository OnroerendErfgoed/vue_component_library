import { mount } from 'cypress/vue';
import { defineComponent, ref, useAttrs } from 'vue';
import OeAdres from '@components/address/OeAdres.vue';
import type { IAdresConfig } from '@components/address/models/adres';

describe('Adres', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      // Ignore errors from chunk files (bundled external libraries)
      if (err.message.includes('chunk-') || err.stack?.includes('chunk-')) {
        return false;
      }
      return true;
    });
  });

  const TestComponent = defineComponent({
    components: { OeAdres },
    setup() {
      const attrs = useAttrs();
      const adresComponent = ref();

      return { attrs, adresComponent };
    },
    template: '<OeAdres ref="adresComponent" v-bind="attrs"/>',
  });

  it('renders', () => {
    mount(TestComponent);
  });

  it('has a title adres', () => {
    mount(TestComponent);
    cy.dataCy('title-adres').should('have.text', 'Adres');
  });

  it('has a title adres - custom title', () => {
    mount(TestComponent, { props: { titleText: 'Custom' } });
    cy.dataCy('title-adres').should('have.text', 'Custom');
  });

  describe('form - default', () => {
    let adresComponent: Cypress.Chainable;

    beforeEach(() => {
      cy.mockLanden();
      mount(TestComponent).then(({ component }) => {
        cy.wait('@dataGetLanden');
        cy.wrap(component.$nextTick()).then(() => {
          adresComponent = component.adresComponent;
        });
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

    describe('country selection België', () => {
      beforeEach(() => {
        cy.mockGewesten();
        cy.mockGemeenten();
        cy.mockBertem();
      });

      it('disables fields when country select is empty', () => {
        getMultiSelect('gemeente').should('have.class', 'is-disabled');
        getMultiSelect('postcode').should('have.class', 'is-disabled');
        getMultiSelect('straat').should('have.class', 'is-disabled');
        getAutocompleteInput('huisnummer').should('have.class', 'vl-input-field--disabled');
        getAutocompleteInput('busnummer').should('have.class', 'vl-input-field--disabled');
      });

      it('disables fields as long as the parent is not filled in', () => {
        // Country selection
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');
        cy.wait('@dataGetGemeentenVlaamsGewest');

        getMultiSelect('gemeente').should('not.have.class', 'is-disabled');
        getMultiSelect('postcode').should('have.class', 'is-disabled');
        getMultiSelect('straat').should('have.class', 'is-disabled');
        getAutocompleteInput('huisnummer').should('have.class', 'vl-input-field--disabled');
        getAutocompleteInput('busnummer').should('have.class', 'vl-input-field--disabled');

        // Gemeente selection
        setMultiSelectValue('gemeente', 'Bertem');

        getMultiSelect('gemeente').should('not.have.class', 'is-disabled');
        getMultiSelect('postcode').should('not.have.class', 'is-disabled');
        getMultiSelect('straat').should('not.have.class', 'is-disabled');
        getAutocompleteInput('huisnummer').should('have.class', 'vl-input-field--disabled');
        getAutocompleteInput('busnummer').should('have.class', 'vl-input-field--disabled');

        // Straat selection
        setMultiSelectValue('straat', 'Dorpstraat');

        getMultiSelect('gemeente').should('not.have.class', 'is-disabled');
        getMultiSelect('postcode').should('not.have.class', 'is-disabled');
        getMultiSelect('straat').should('not.have.class', 'is-disabled');
        getAutocompleteInput('huisnummer').should('not.have.class', 'vl-input-field--disabled');
        getAutocompleteInput('busnummer').should('have.class', 'vl-input-field--disabled');

        // Huisnummer selection
        setAutocompleteValue('huisnummer', '416');

        getMultiSelect('gemeente').should('not.have.class', 'is-disabled');
        getMultiSelect('postcode').should('not.have.class', 'is-disabled');
        getMultiSelect('straat').should('not.have.class', 'is-disabled');
        getAutocompleteInput('huisnummer').should('not.have.class', 'vl-input-field--disabled');
        getAutocompleteInput('busnummer').should('not.have.class', 'vl-input-field--disabled');
      });

      it('fills in the form', () => {
        fillInOeAdresBelgium();
      });

      it('clears the form when changing country', () => {
        fillInOeAdresBelgium();

        getMultiSelect('land').select(2).select(1);

        getMultiSelect('gemeente').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('postcode').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('straat').find('.multiselect-single-label-text').should('not.exist');
        getAutocompleteInput('huisnummer').should('have.value', '');
        getAutocompleteInput('busnummer').should('have.value', '');
      });

      it('triggers required validation after validate function is invoked', () => {
        fillInOeAdresBelgium();

        getMultiSelect('land').select(2).select(1);

        cy.wrap(adresComponent).should('not.be.undefined').invoke('validate');

        getMultiSelect('gemeente').parent().should('have.class', 'vl-multiselect--error');
        getFormError('gemeente').should('have.text', 'Het veld gemeente is verplicht.');

        getMultiSelect('postcode').parent().should('have.class', 'vl-multiselect--error');
        getFormError('postcode').should('have.text', 'Het veld postcode is verplicht.');

        getMultiSelect('straat').parent().should('have.class', 'vl-multiselect--error');
        getFormError('straat').should('have.text', 'Het veld straat is verplicht.');

        getAutocompleteInput('huisnummer').should('have.class', 'vl-input-field--error');
        getFormError('huisnummer').should('have.text', 'Het veld huisnummer is verplicht.');

        getAutocompleteInput('busnummer').should('not.have.class', 'vl-input-field--error');
        getFormError('busnummer').should('not.exist');
      });

      it('allows huisnummer to be free text input when no house numbers were found', () => {
        cy.mockDurbuy();

        // Country selection
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');

        cy.wait('@dataGetGemeentenWaalsGewest');

        // Gemeente selection
        setMultiSelectValue('gemeente', 'Durbuy');
        getMultiSelect('gemeente').find('.multiselect-single-label-text').should('have.text', 'Durbuy');

        cy.wait('@dataGetPostinfoDurbuy');
        cy.wait('@dataGetStratenDurbuy');

        // Straat selection
        setMultiSelectValue('straat', 'Hiva');
        getMultiSelect('straat').find('.multiselect-single-label-text').should('have.text', 'Hiva');

        cy.wait('@dataGetAdressenDurbuy');

        getTextInput('huisnummer').should('exist');
      });

      it('requires busnummer to be free text input when no house numbers were found', () => {
        // Country selection
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');

        cy.wait('@dataGetGemeentenVlaamsGewest');

        // Gemeente selection
        setMultiSelectValue('gemeente', 'Bertem');
        getMultiSelect('gemeente').find('.multiselect-single-label-text').should('have.text', 'Bertem');
        cy.wait('@dataGetStratenBertem');

        // Straat selection
        setMultiSelectValue('straat', 'Dorpstraat');
        getMultiSelect('straat').find('.multiselect-single-label-text').should('have.text', 'Dorpstraat');

        // Huisnummer selection
        setAutocompleteValue('huisnummer', '383A');
        getAutocompleteInput('huisnummer').should('have.value', '383A');

        getTextInput('busnummer').should('exist');
      });

      it('sorts the gemeenten by naam using filtering-sort-func', () => {
        // Country selection
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');

        // Gemeente selection
        cy.wait('@dataGetGemeentenVlaamsGewest');
        cy.wait('@dataGetGemeentenBrusselsHoofdstedelijkGewest');
        cy.wait('@dataGetGemeentenWaalsGewest');
        getMultiSelect('gemeente').click();
        getMultiSelect('gemeente').find('.multiselect-search').type('br');

        getMultiSelect('gemeente')
          .get('.multiselect-option')
          .then(($options) => {
            const optionsText = Array.from($options)
              .filter((option) => option.offsetParent !== null)
              .map((option) => option.textContent?.trim());

            expect(optionsText).to.deep.equal([
              "'s Gravenbrakel",
              'Braives',
              'Brakel',
              'Brasschaat',
              'Brecht',
              'Bredene',
              'Bree',
              'Brugelette',
              'Brugge',
              'Brunehaut',
              'Brussel',
              'Eigenbrakel',
              'Jemeppe-sur-Sambre',
              'Kasteelbrakel',
              'La Bruyère',
              'Libramont-Chevigny',
              'Sambreville',
              'Sint-Lambrechts-Woluwe',
              'Sombreffe',
              'Stabroek',
              'Willebroek',
            ]);
          });
      });

      it('sorts the straten by naam using filtering-sort-func', () => {
        // Country selection
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');

        // Gemeente selection
        cy.wait('@dataGetGemeentenVlaamsGewest');
        cy.wait('@dataGetGemeentenBrusselsHoofdstedelijkGewest');
        cy.wait('@dataGetGemeentenWaalsGewest');
        setMultiSelectValue('gemeente', 'Bertem');
        setMultiSelectValue('postcode', '3060');

        getMultiSelect('straat').click();
        getMultiSelect('straat').find('.multiselect-search').type('Do');

        getMultiSelect('straat')
          .get('.multiselect-option')
          .then(($options) => {
            const optionsText = Array.from($options)
              .filter((option) => option.offsetParent !== null)
              .map((option) => option.textContent?.trim());

            expect(optionsText).to.deep.equal([
              'Dokter Tielemansstraat',
              'Dorpsplein',
              'Dorpstraat',
              'Fr. Dottermansstraat',
            ]);
          });
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

      it('triggers required validation after validate function is invoked', () => {
        fillInOeAdresOther();

        getMultiSelect('land').select(3);

        cy.wrap(adresComponent).should('not.be.undefined').invoke('validate');

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
      getLabel('land').should('have.text', 'Land');
      getLabelAnnotation('land').should('have.text', 'VERPLICHT');
    });

    it('has an input label gemeente', () => {
      getLabel('gemeente').should('have.text', 'Gemeente');
      getLabelAnnotation('gemeente').should('have.text', 'VERPLICHT');
    });

    it('has an input label postcode', () => {
      getLabel('postcode').should('have.text', 'Postcode');
      getLabelAnnotation('postcode').should('have.text', 'VERPLICHT');
    });

    it('has an input label straat', () => {
      getLabel('straat').should('have.text', 'Straat');
      getLabelAnnotation('straat').should('have.text', 'VERPLICHT');
    });

    it('has an input label huisnummer', () => {
      getLabel('huisnummer').should('have.text', 'Huisnummer');
      getLabelAnnotation('huisnummer').should('have.text', 'VERPLICHT');
    });

    it('has an input label busnummer', () => {
      getLabel('busnummer').should('have.text', 'Busnummer');
    });
  });

  describe('form - disabled state', () => {
    beforeEach(() => {
      cy.mockLanden();
      cy.mockGewesten();
      cy.mockGemeenten();
      cy.mockDurbuy();

      mount(TestComponent, {
        props: {
          modDisabled: true,
          adres: {
            land: { code: 'BE', naam: 'België' },
            gemeente: { naam: 'Durbuy', niscode: '83012' },
            postcode: { uri: 'https://data.vlaanderen.be/id/postinfo/6940', nummer: '6940' },
            straat: { naam: 'Hiva', id: '125552', uri: 'https://data.vlaanderen.be/id/straatnaam/125552' },
            adres: { huisnummer: '2' },
          },
        },
      }).then(() => {
        cy.wait('@dataGetLanden');
        cy.wait('@dataGetGemeentenWaalsGewest');
      });
    });

    it('disables all fields', () => {
      getMultiSelect('land').should('be.disabled');
      getMultiSelect('gemeente').should('have.class', 'is-disabled');
      getMultiSelect('postcode').should('have.class', 'is-disabled');
      getMultiSelect('straat').should('have.class', 'is-disabled');
      getAutocompleteInput('huisnummer').should('have.class', 'vl-input-field--disabled');
      getAutocompleteInput('busnummer').should('have.class', 'vl-input-field--disabled');
    });

    it('should show the selected address', () => {
      getMultiSelect('land').find(':selected').should('have.text', 'België');
      getMultiSelect('gemeente').find('.multiselect-single-label-text').should('have.text', 'Durbuy');
      getMultiSelect('postcode').find('.multiselect-single-label-text').should('have.text', '6940');
      getMultiSelect('straat').find('.multiselect-single-label-text').should('have.text', 'Hiva');
      getAutocompleteInput('huisnummer').should('have.value', '2');
      getAutocompleteInput('busnummer').should('have.value', '');
    });

    it('should not show action buttons when disabled', () => {
      cy.dataCy('action-postcode-not-found').should('not.exist');
      cy.dataCy('action-straat-not-found').should('not.exist');
      cy.dataCy('action-huisnummer-not-found').should('not.exist');
    });
  });

  describe('form - 2-way binding', () => {
    beforeEach(() => {
      cy.mockLanden();
      cy.mockGewesten();
      cy.mockProvincies();
      cy.mockGemeenten();
      cy.mockBierbeek();
      cy.mockBrussel();
      cy.mockBertem();
    });

    it('fills in the predefined values - case 1 - no freetext', () => {
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
              uri: 'https://data.vlaanderen.be/id/postinfo/3060',
            },
            straat: {
              naam: 'Dorpstraat',
              id: '32110',
              uri: 'https://data.vlaanderen.be/id/straatnaam/32110',
            },
            adres: {
              huisnummer: '416',
              busnummer: '0101',
            },
          },
        }),
        template: '<OeAdres v-model:adres="adres"/>',
      });

      cy.wait('@dataGetLanden');
      cy.wait('@dataGetGemeentenVlaamsGewest');
      cy.wait('@dataGetHuisnummersDorpstraatBertem');

      getMultiSelect('land').find(':selected').should('have.text', 'België');
      getMultiSelect('gemeente').find('.multiselect-single-label-text').should('have.text', 'Bertem');
      getMultiSelect('postcode').find('.multiselect-single-label-text').should('have.text', '3060');
      getMultiSelect('straat').find('.multiselect-single-label-text').should('have.text', 'Dorpstraat');
      getAutocompleteInput('huisnummer').should('have.value', '416');

      getAutocompleteInput('busnummer').should('have.value', '0101');
    });

    it('fills in the predefined values - case 2 - huis- and busnummer freetext', () => {
      mount(TestComponent, {
        data: () => ({
          adres: {
            land: {
              code: 'BE',
              naam: 'België',
            },
            adres: {
              huisnummer: '4',
              busnummer: 'B',
            },
            straat: {
              id: '19887',
              uri: 'https://data.vlaanderen.be/id/straatnaam/19887',
              naam: 'Havenlaan',
            },
            gemeente: {
              naam: 'Brussel',
              niscode: '21004',
            },
            postcode: {
              uri: 'https://data.vlaanderen.be/id/postinfo/1000',
              nummer: '1000',
            },
          },
        }),
        template: '<OeAdres v-model:adres="adres"/>',
      });

      cy.wait('@dataGetLanden');

      getMultiSelect('land').find(':selected').should('have.text', 'België');
      cy.wait('@dataGetGemeentenBrusselsHoofdstedelijkGewest');
      getMultiSelect('gemeente').find('.multiselect-single-label-text').should('have.text', 'Brussel');
      getMultiSelect('postcode').find('.multiselect-single-label-text').should('have.text', '1000');
      getMultiSelect('straat').find('.multiselect-single-label-text').should('have.text', 'Havenlaan');
      getTextInput('huisnummer').should('have.value', '4');
      getTextInput('busnummer').should('have.value', 'B');
    });

    it('fills in the predefined values - case 3 - huisnummer autocomplete - busnummer freetext', () => {
      mount(TestComponent, {
        data: () => ({
          adres: {
            land: {
              code: 'BE',
              naam: 'België',
            },
            adres: {
              busnummer: 'B',
              huisnummer: '5',
            },
            straat: {
              id: '32284',
              uri: 'https://data.vlaanderen.be/id/straatnaam/32284',
              naam: 'Krijkelberg',
            },
            gemeente: {
              naam: 'Bierbeek',
              niscode: '24011',
            },
            postcode: {
              uri: 'https://data.vlaanderen.be/id/postinfo/3360',
              nummer: '3360',
            },
            provincie: {
              naam: 'Vlaams-Brabant',
              niscode: '20001',
            },
            deelgemeente: {},
          },
        }),
        template: '<OeAdres v-model:adres="adres"/>',
      });

      cy.wait('@dataGetGemeentenVlaamsGewest');

      getMultiSelect('land').find(':selected').should('have.text', 'België');
      getMultiSelect('gemeente').find('.multiselect-single-label-text').should('have.text', 'Bierbeek');
      getMultiSelect('postcode').find('.multiselect-single-label-text').should('have.text', '3360');
      getMultiSelect('straat').find('.multiselect-single-label-text').should('have.text', 'Krijkelberg');
      getAutocompleteInput('huisnummer').should('have.value', '5');

      getTextInput('busnummer').should('have.value', 'B');
    });

    it('fills in the predefined values - case 4 - country with enriched data', () => {
      mount(TestComponent, {
        data: () => ({
          adres: {
            land: {
              code: 'BH',
              naam: 'Bahrain',
            },
            gemeente: {
              naam: 'Manama',
            },
            postcode: {
              nummer: '12345',
            },
            straat: {
              naam: 'Al-Fateh Highway',
            },
            adres: {
              huisnummer: '123',
            },
          },
        }),
        template: '<OeAdres v-model:adres="adres"/>',
      });

      getMultiSelect('land').find(':selected').should('have.text', 'Bahrain');
      getTextInput('gemeente').should('have.value', 'Manama');
      getTextInput('postcode').should('have.value', '12345');
      getTextInput('straat').should('have.value', 'Al-Fateh Highway');
      getTextInput('huisnummer').should('have.value', '123');
      getTextInput('busnummer').should('have.value', '');
    });

    it('fills in the predefined values - case 5 - gewest and provincie narrow other options', () => {
      mount(TestComponent, {
        data: () => ({
          adres: {
            land: {
              code: 'BE',
              naam: 'België',
            },
            adres: {},
            straat: {
              id: '32284',
              uri: 'https://data.vlaanderen.be/id/straatnaam/32284',
              naam: 'Krijkelberg',
            },
            gemeente: {
              naam: 'Bierbeek',
              niscode: '24011',
            },
            postcode: {
              uri: 'https://data.vlaanderen.be/id/postinfo/3360',
              nummer: '3360',
            },
            gewest: { naam: 'Vlaams Gewest', niscode: '2000' },
            provincie: {
              naam: 'Vlaams-Brabant',
              niscode: '20001',
            },
          },
          config: {
            land: { required: true },
            gewest: { required: true },
            provincie: { required: false },
            gemeente: { required: false },
            postcode: { required: false },
            straat: { required: false },
            huisnummer: { required: false },
            busnummer: { required: false },
          },
        }),
        template: '<OeAdres v-model:adres="adres" :config="config" />',
      });

      getMultiSelect('land').find(':selected').should('have.text', 'België');
      getMultiSelect('gewest').find('.multiselect-single-label-text').should('have.text', 'Vlaams Gewest');

      cy.wait('@dataGetProvinciesVlaamsGewest');

      getMultiSelect('provincie').find('.multiselect-single-label-text').should('have.text', 'Vlaams-Brabant');
      getMultiSelect('provincie').find('.multiselect-option').should('have.length', 5);

      cy.wait('@dataGetGemeentenVlaamsGewest');

      getMultiSelect('gemeente').find('.multiselect-option').should('have.length', 63);
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
        template: '<OeAdres v-model:adres="adres"/>',
      }).then(({ component }) => {
        // Wait for initial data loading
        cy.wait('@dataGetGemeentenVlaamsGewest');
        cy.wait('@dataGetPostinfoBertem');
        cy.wait('@dataGetStratenBertem');
        cy.wait('@dataGetAdressenDorpstraatBertem');

        getMultiSelect('gemeente').click();
        getMultiSelect('gemeente').find('.multiselect-search').type('Bierbeek');
        getMultiSelect('gemeente').find('.multiselect-option').click();

        cy.wait('@dataGetStratenBierbeek');

        // Wait for Vue's reactivity to update
        cy.wrap(component.$nextTick()).then(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expect((component.$data as any).adres).to.deep.equal({
            land: {
              naam: 'België',
              code: 'BE',
            },
            gewest: undefined,
            provincie: undefined,
            gemeente: {
              naam: 'Bierbeek',
              niscode: '24011',
            },
            postcode: {},
            straat: {},
            adres: {},
          });
        });
      });
    });

    it('completes the address with a valid structure when all fields are filled ', () => {
      mount(TestComponent, {
        data: () => ({
          adres: {},
        }),
        template: '<OeAdres v-model:adres="adres"/> <pre>{{ adres }}</pre>',
      }).then(({ component }) => {
        // Wait for initial data loading
        cy.wait('@dataGetLanden');
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');
        cy.wait('@dataGetGemeentenVlaamsGewest');

        setMultiSelectValue('gemeente', 'Bertem');
        cy.wait('@dataGetPostinfoBertem');

        setMultiSelectValue('postcode', '3060');
        cy.wait('@dataGetStratenBertem');

        setMultiSelectValue('straat', 'Dorpstraat');
        cy.wait('@dataGetAdressenDorpstraatBertem');

        setAutocompleteValue('huisnummer', '383A');
        cy.wait('@dataGetHuisnummer383ABertem');

        // Wait for Vue's reactivity to update
        cy.wrap(component.$nextTick()).then(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expect((component.$data as any).adres).to.deep.equal({
            land: {
              naam: 'België',
              code: 'BE',
            },
            gewest: undefined,
            provincie: undefined,
            gemeente: { naam: 'Bertem', niscode: '24009' },
            postcode: { nummer: '3060', uri: 'https://data.vlaanderen.be/id/postinfo/3060' },
            straat: { naam: 'Dorpstraat', id: '32110', uri: 'https://data.vlaanderen.be/id/straatnaam/32110' },
            adres: { huisnummer: '383A', uri: 'https://data.vlaanderen.be/id/adres/466831', id: '466831' },
          });
        });
      });
    });
  });

  describe('form - clear descendants on change', () => {
    describe('predefined values', () => {
      const mountComponent = () =>
        mount(TestComponent, {
          data: () => ({
            adres: {
              land: {
                naam: 'België',
                code: 'BE',
              },
              gewest: { naam: 'Vlaams Gewest', niscode: '2000' },
              provincie: { naam: 'Vlaams-Brabant', niscode: '20001' },
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
            config: {
              land: { required: true },
              gewest: { required: true },
              provincie: { required: true },
              gemeente: { required: false },
              postcode: { required: false },
              straat: { required: false },
              huisnummer: { required: false },
              busnummer: { required: false },
            },
          }),
          template: '<OeAdres v-model:adres="adres" :config="config" />',
        });

      beforeEach(() => {
        cy.mockLanden();
        cy.mockGewesten();
        cy.mockProvincies();
        cy.mockGemeenten();
        cy.mockBertem();
        cy.mockBierbeek();
        cy.mockBrussel();

        mountComponent();

        cy.wait('@dataGetLanden');
        cy.wait('@dataGetGemeentenVlaamsGewest');
        cy.wait('@dataGetPostinfoBertem');
        cy.wait('@dataGetStratenBertem');
        cy.wait('@dataGetAdressenDorpstraatBertem');
      });

      it('clears gewest, provincie, gemeente, postcode, straat, huisnummer and busnummer autocomplete when changing land', () => {
        getMultiSelect('land').select(2).select(1);

        getMultiSelect('gewest').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('provincie').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('gemeente').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('postcode').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('straat').find('.multiselect-single-label-text').should('not.exist');
        getAutocompleteInput('huisnummer').should('have.value', '');
        getAutocompleteInput('busnummer').should('have.value', '');
      });

      it('clears provincie, gemeente, postcode, straat, huisnummer and busnummer autocomplete when changing gewest', () => {
        setMultiSelectValue('gewest', 'Waals Gewest');

        cy.wait('@dataGetProvinciesWaalsGewest');

        getMultiSelect('provincie').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('gemeente').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('postcode').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('straat').find('.multiselect-single-label-text').should('not.exist');
        getAutocompleteInput('huisnummer').should('have.value', '');
        getAutocompleteInput('busnummer').should('have.value', '');
      });

      it('clears gemeente, postcode, straat, huisnummer and busnummer autocomplete when changing provincie', () => {
        setMultiSelectValue('provincie', 'Antwerpen');

        getMultiSelect('gemeente').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('postcode').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('straat').find('.multiselect-single-label-text').should('not.exist');
        getAutocompleteInput('huisnummer').should('have.value', '');
        getAutocompleteInput('busnummer').should('have.value', '');
      });

      it('clears postcode, straat, huisnummer and busnummer autocomplete when changing gemeente', () => {
        setMultiSelectValue('gemeente', 'Bierbeek');

        cy.wait('@dataGetPostinfoBierbeek');
        cy.wait('@dataGetStratenBierbeek');

        getMultiSelect('postcode').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('straat').find('.multiselect-single-label-text').should('not.exist');
        getAutocompleteInput('huisnummer').should('have.value', '');
        getAutocompleteInput('busnummer').should('have.value', '');
      });

      it('clears huisnummer and busnummer autocomplete when changing straat', () => {
        setMultiSelectValue('straat', 'Alsemberglaan');

        getAutocompleteInput('huisnummer').should('have.value', '');
        getAutocompleteInput('busnummer').should('have.value', '');
      });

      it('clears busnummer autocomplete when changing huisnummer', () => {
        setAutocompleteValue('huisnummer', '416');

        getAutocompleteInput('busnummer').should('have.value', '');
      });
    });

    describe('specific input sequence', () => {
      const mountComponent = () =>
        mount(TestComponent, {
          data: () => ({
            adres: {},
            config: {
              land: { required: true },
              gewest: { required: true },
              provincie: { required: true },
              gemeente: { required: false },
              postcode: { required: false },
              straat: { required: false },
              huisnummer: { required: false },
              busnummer: { required: false },
            },
          }),
          template: '<OeAdres v-model:adres="adres" :config="config" />',
        });

      beforeEach(() => {
        cy.mockLanden();
        cy.mockGewesten();
        cy.mockProvincies();
        cy.mockGemeenten();
        cy.mockBertem();

        mountComponent();

        cy.wait('@dataGetLanden');
      });

      it('correctly clears descendants when changing gewest after filling in other fields first - starting with provincie', () => {
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');
        cy.wait('@dataGetGemeentenVlaamsGewest');
        cy.wait('@dataGetProvinciesVlaamsGewest');

        setMultiSelectValue('provincie', 'Vlaams-Brabant');

        setMultiSelectValue('gemeente', 'Bertem');
        cy.wait('@dataGetPostinfoBertem');
        cy.wait('@dataGetStratenBertem');

        setMultiSelectValue('straat', 'Dorpstraat');
        cy.wait('@dataGetAdressenDorpstraatBertem');

        setAutocompleteValue('huisnummer', '416');

        setMultiSelectValue('gewest', 'Waals Gewest');
        cy.wait('@dataGetProvinciesWaalsGewest');

        getMultiSelect('provincie').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('gemeente').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('postcode').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('straat').find('.multiselect-single-label-text').should('not.exist');
        getAutocompleteInput('huisnummer').should('have.value', '');
        getAutocompleteInput('busnummer').should('have.value', '');
      });

      it('correctly clears descendants when changing gewest after filling in other fields first - starting with gemeente', () => {
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');
        cy.wait('@dataGetGemeentenVlaamsGewest');
        cy.wait('@dataGetProvinciesVlaamsGewest');

        setMultiSelectValue('gemeente', 'Bertem');
        cy.wait('@dataGetPostinfoBertem');
        cy.wait('@dataGetStratenBertem');

        setMultiSelectValue('postcode', '3060');

        setMultiSelectValue('straat', 'Dorpstraat');
        cy.wait('@dataGetAdressenDorpstraatBertem');

        setAutocompleteValue('huisnummer', '416');

        setMultiSelectValue('gewest', 'Waals Gewest');
        cy.wait('@dataGetProvinciesWaalsGewest');

        getMultiSelect('provincie').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('gemeente').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('postcode').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('straat').find('.multiselect-single-label-text').should('not.exist');
        getAutocompleteInput('huisnummer').should('have.value', '');
        getAutocompleteInput('busnummer').should('have.value', '');
      });

      it('correctly clears descendants when changing provincie after filling in other fields first - starting with gemeente', () => {
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');
        cy.wait('@dataGetGemeentenVlaamsGewest');
        cy.wait('@dataGetProvinciesVlaamsGewest');

        setMultiSelectValue('gemeente', 'Bertem');
        cy.wait('@dataGetPostinfoBertem');
        cy.wait('@dataGetStratenBertem');

        setMultiSelectValue('postcode', '3060');

        setMultiSelectValue('straat', 'Dorpstraat');
        cy.wait('@dataGetAdressenDorpstraatBertem');

        setAutocompleteValue('huisnummer', '416');

        setMultiSelectValue('provincie', 'Antwerpen');

        getMultiSelect('gemeente').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('postcode').find('.multiselect-single-label-text').should('not.exist');
        getMultiSelect('straat').find('.multiselect-single-label-text').should('not.exist');
        getAutocompleteInput('huisnummer').should('have.value', '');
        getAutocompleteInput('busnummer').should('have.value', '');
      });
    });
  });

  describe('form - custom API', () => {
    it('addresses the network call to the given API', () => {
      const api = 'https://test.be';
      cy.intercept(`${api}/adressenregister/landen`, {}).as('dataGetLanden');

      mount(TestComponent, {
        data: () => ({ api }),
        template: '<OeAdres :api="api"/>',
      }).then(() => {
        cy.wait('@dataGetLanden').then((intercept) => {
          expect(intercept.request.url).to.equal('https://test.be/adressenregister/landen');
        });
      });
    });
  });

  describe('form - custom config', () => {
    let adresComponent: Cypress.Chainable;

    describe('applies custom configuration to free-text fields - land and gemeente required', () => {
      const config: IAdresConfig = {
        land: {
          required: true,
        },
        gewest: {
          required: false,
          hidden: true,
        },
        provincie: {
          required: false,
          hidden: true,
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
        cy.mockLanden();
        mount(TestComponent, {
          setup() {
            const adresComponent = ref();
            const c = config;

            return { c, adresComponent };
          },
          template: '<OeAdres ref="adresComponent" :config="c"/>',
        }).then(({ component }) => {
          cy.wait('@dataGetLanden');
          cy.wrap(component.$nextTick()).then(() => {
            adresComponent = component.adresComponent;
          });
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

      it('triggers required validation after validate function is invoked', () => {
        fillInOeAdresOther();

        getMultiSelect('land').select(3);

        cy.wrap(adresComponent).should('not.be.undefined').invoke('validate');

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
        gewest: {
          required: false,
          hidden: true,
        },
        provincie: {
          required: false,
          hidden: true,
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
        cy.mockLanden();

        mount(TestComponent, {
          setup() {
            const adresComponent = ref();
            const c = config;

            return { c, adresComponent };
          },
          template: '<OeAdres ref="adresComponent" :config="c"/>',
        }).then(({ component }) => {
          cy.wait('@dataGetLanden');
          cy.wrap(component.$nextTick()).then(() => {
            adresComponent = component.adresComponent;
          });
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

      it('triggers required validation after validate function is invoked', () => {
        fillInOeAdresOther();

        getMultiSelect('land').select(3);

        cy.wrap(adresComponent).should('not.be.undefined').invoke('validate');

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
        gewest: {
          required: false,
          hidden: true,
        },
        provincie: {
          required: false,
          hidden: true,
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
        cy.mockLanden();
        cy.mockGewesten();
        cy.mockProvincies();
        cy.mockGemeenten();
        cy.mockBertem();

        mount(TestComponent, {
          setup() {
            const adresComponent = ref();
            const c = config;

            return { c, adresComponent };
          },
          template: '<OeAdres ref="adresComponent" :config="c"/>',
        }).then(({ component }) => {
          cy.wait('@dataGetLanden');
          cy.wrap(component.$nextTick()).then(() => {
            adresComponent = component.adresComponent;
          });
        });
      });

      it('triggers required validation after validate function is invoked', () => {
        fillInOeAdresBelgium();

        getMultiSelect('land').select(3).select(1);

        cy.wrap(adresComponent).should('not.be.undefined').invoke('validate');

        getMultiSelect('gemeente').parent().should('have.class', 'vl-multiselect--error');
        getFormError('gemeente').should('have.text', 'Het veld gemeente is verplicht.');

        getMultiSelect('postcode').parent().should('have.class', 'vl-multiselect--error');
        getFormError('postcode').should('have.text', 'Het veld postcode is verplicht.');

        getMultiSelect('straat').parent().should('have.class', 'vl-multiselect--error');
        getFormError('straat').should('have.text', 'Het veld straat is verplicht.');

        getAutocompleteInput('huisnummer').should('have.class', 'vl-input-field--error');
        getFormError('huisnummer').should('have.text', 'Het veld huisnummer is verplicht.');

        getAutocompleteInput('busnummer').should('have.class', 'vl-input-field--error');
        getFormError('busnummer').should('have.text', 'Het veld busnummer is verplicht.');
      });
    });
  });

  describe('form - specific country', () => {
    beforeEach(() => {
      mount(TestComponent, {
        template: '<OeAdres countryId="BE" v-model:adres="adres"/>',
      });
    });

    it('does not render the land entry', () => {
      cy.dataCy(`label-land`).should('not.exist');
      getMultiSelect('land').should('not.exist');

      getMultiSelect('gemeente').should('exist');
      getMultiSelect('postcode').should('exist');
      getMultiSelect('straat').should('exist');
      getAutocompleteInput('huisnummer').should('exist');
      getAutocompleteInput('busnummer').should('exist');
    });
  });

  describe('form - multi select options limit', () => {
    beforeEach(() => {
      cy.mockLanden();
      cy.mockGewesten();
      cy.mockGemeenten();
      cy.mockAalst();

      mount(TestComponent, {
        template: '<OeAdres :options-limit="3" v-model:adres="adres"/>',
      });
    });
    it('sets the max amount of items at multi-select elements', () => {
      getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');

      cy.wait('@dataGetGemeentenVlaamsGewest');

      getMultiSelect('gemeente').click();
      getMultiSelect('gemeente').find('.multiselect-option').should('have.length', 3);

      getMultiSelect('gemeente').find('.multiselect-search').type('Aalst');
      getMultiSelect('gemeente').find('.multiselect-option').click();
      getMultiSelect('postcode').click();
      getMultiSelect('postcode').find('.multiselect-option').should('have.length', 3);

      getMultiSelect('postcode').find('.multiselect-search').type('9300');
      getMultiSelect('postcode').find('.multiselect-option').click();
      getMultiSelect('straat').click();
      getMultiSelect('straat').find('.multiselect-option').should('have.length', 3);
    });
  });

  describe('form - gewest & provincie', () => {
    beforeEach(() => {
      cy.mockLanden();
      cy.mockGewesten();
      cy.mockProvincies();
      cy.mockGemeenten();
    });

    describe('applies custom configuration - gewest & provincie required', () => {
      let adresComponent: Cypress.Chainable;

      const config: IAdresConfig = {
        gewest: {
          required: true,
        },
        provincie: {
          required: true,
        },
        gemeente: {
          required: false,
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
          setup() {
            const adresComponent = ref();
            const c = config;

            return { c, adresComponent };
          },
          template: '<OeAdres ref="adresComponent" countryId="BE" :config="c"/>',
        }).then(({ component }) => {
          cy.wait('@dataGetLanden');
          cy.wait('@dataGetGewesten');
          cy.wrap(component.$nextTick()).then(() => {
            adresComponent = component.adresComponent;
          });
        });
      });

      it('has an input label gewest', () => {
        getLabel('gewest').should('have.text', 'Gewest');
      });

      it('has an input label provincie', () => {
        getLabel('provincie').should('have.text', 'Provincie');
      });

      it('shows a list of gewesten and provincies', () => {
        getMultiSelect('gewest').click();
        getMultiSelect('gewest').find('.multiselect-option').should('have.length', 3);
        getMultiSelect('gewest').find('.multiselect-caret').click();

        cy.wait('@dataGetProvinciesVlaamsGewest');

        getMultiSelect('provincie').click();
        getMultiSelect('provincie').find('.multiselect-option').should('have.length', 10);
      });

      it('narrows list of provincies and gemeenten on gewest selection', () => {
        setMultiSelectValue('gewest', 'Vlaams Gewest');
        cy.wait('@dataGetProvinciesVlaamsGewest');
        getMultiSelect('provincie').click();
        getMultiSelect('provincie').find('.multiselect-option').should('have.length', 5);
        getMultiSelect('provincie').find('.multiselect-caret').click();
      });

      it('disables provincie when selecting "Brussels Hoofdstedelijk Gewest"', () => {
        setMultiSelectValue('gewest', 'Brussels');
        getMultiSelect('provincie').should('have.class', 'is-disabled');
      });

      it('triggers required validation after validate function is invoked', () => {
        cy.wrap(adresComponent).should('not.be.undefined').invoke('validate');

        getMultiSelect('gewest').parent().should('have.class', 'vl-multiselect--error');
        getFormError('gewest').should('have.text', 'Het veld gewest is verplicht.');

        getMultiSelect('provincie').parent().should('have.class', 'vl-multiselect--error');
        getFormError('provincie').should('have.text', 'Het veld provincie is verplicht.');
      });
    });

    describe('applies custom configuration - gewest & provincie optional', () => {
      const config: IAdresConfig = {
        gewest: {
          required: false,
        },
        provincie: {
          required: false,
        },
        gemeente: {
          required: false,
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
          setup() {
            const c = config;

            return { c };
          },
          template: '<OeAdres :config="c"/>',
        });
      });

      it('narrows list of gemeenten on provincie selection without gewest selection', () => {
        cy.wait('@dataGetLanden');
        getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');

        cy.wait('@dataGetGewesten');
        cy.wait('@dataGetProvinciesVlaamsGewest');
        setMultiSelectValue('provincie', 'Vlaams-Brabant');

        getMultiSelect('gemeente').click();
        getMultiSelect('gemeente').find('.multiselect-option').first().should('contain.text', 'Aarschot');
      });
    });
  });

  describe('form - postcode & busnummer', () => {
    beforeEach(() => {
      cy.mockLanden();
      cy.mockGewesten();
      cy.mockProvincies();
      cy.mockGemeenten();
    });

    const config: IAdresConfig = {
      gewest: {
        required: true,
        hidden: true,
      },
      provincie: {
        required: true,
        hidden: true,
      },
      gemeente: {
        required: false,
      },
      postcode: {
        required: false,
        hidden: true,
      },
      straat: {
        required: false,
      },
      huisnummer: {
        required: false,
      },
      busnummer: {
        required: false,
        hidden: true,
      },
    };

    it('the postcode and busnummer are undefined', () => {
      mount(TestComponent, {
        data: () => ({
          adres: {},
        }),
        setup() {
          const c = config;

          return { c };
        },
        template: '<OeAdres v-model:adres="adres" :config="c" country-id="BE" />',
      }).then(({ component }) => {
        cy.wait('@dataGetGemeentenVlaamsGewest');
        getMultiSelect('gemeente').click();
        getMultiSelect('gemeente').find('.multiselect-search').type('Lummen');
        getMultiSelect('gemeente')
          .find('.multiselect-option')
          .click()
          .then(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((component.$data as any).adres).to.deep.equal({
              land: { code: 'BE', naam: undefined },
              gewest: undefined,
              provincie: undefined,
              gemeente: {
                naam: 'Lummen',
                niscode: '71037',
              },
              postcode: undefined,
              straat: {},
              adres: {},
            });
          });
      });
    });

    it('the postcode and busnummer fields are hidden', () => {
      mount(TestComponent, {
        setup() {
          const c = config;

          return { c };
        },
        template: '<OeAdres :config="c" country-id="BE" />',
      }).then(() => {
        cy.wait('@dataGetGemeentenVlaamsGewest');
        getMultiSelect('postcode').should('not.exist');
        getAutocompleteRootElement('busnummer').should('not.exist');
      });
    });
  });
});

const getLabel = (field: string) => cy.dataCy(`label-${field}`).find('span');
const getLabelAnnotation = (field: string) => cy.dataCy(`label-${field}`).children().last();
const getMultiSelect = (field: string) => cy.dataCy(`select-${field}`);
const getAutocompleteRootElement = (field: string) => cy.dataCy(`autocomplete-${field}`);
const getAutocompleteInput = (field: string) => getAutocompleteRootElement(field).children().first();
const getTextInput = (field: string) => cy.dataCy(`input-${field}`);
const getFormError = (field: string) => cy.dataCy(`form-error-${field}`);

const fillInOeAdresBelgium = () => {
  // Country selection
  getMultiSelect('land').select(1).find(':selected').should('have.text', 'België');

  // Gemeente selection
  cy.wait('@dataGetGemeentenVlaamsGewest');
  setMultiSelectValue('gemeente', 'Bertem');
  getMultiSelect('gemeente').find('.multiselect-single-label-text').should('have.text', 'Bertem');

  // Postcode selection
  cy.wait('@dataGetPostinfoBertem');

  setMultiSelectValue('postcode', '3060');
  getMultiSelect('postcode').find('.multiselect-single-label-text').should('have.text', '3060');

  // Straat selection
  cy.wait('@dataGetStratenBertem');
  setMultiSelectValue('straat', 'Dorpstraat');
  getMultiSelect('straat').find('.multiselect-single-label-text').should('have.text', 'Dorpstraat');

  // Huisnummer with multiple busnummers
  cy.wait('@dataGetAdressenDorpstraatBertem');
  setAutocompleteValue('huisnummer', '416');
  getAutocompleteInput('huisnummer').should('have.value', '416');

  // Busnummer selection
  cy.wait('@dataGetHuisnummersDorpstraatBertem');
  setAutocompleteValue('busnummer', '010');
  getAutocompleteInput('busnummer').should('have.value', '0101');
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
  getMultiSelect(field).find('.multiselect-search').type(value);
  getMultiSelect(field).find('.multiselect-option').click();
};

const setAutocompleteValue = (field: string, value: string) => {
  getAutocompleteInput(field).click();
  getAutocompleteInput(field).type(value);
};
