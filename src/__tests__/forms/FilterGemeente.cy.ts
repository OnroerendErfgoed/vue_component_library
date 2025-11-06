/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import { OeFilterGemeente } from '@components/forms';
import { Niscode } from '@models/niscode.enum';
import type { IGemeente } from '@models/locatie';

describe('FilterGemeente', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      // Ignore errors from chunk files (bundled external libraries)
      if (err.message.includes('chunk-') || err.stack?.includes('chunk-')) {
        return false;
      }
      return true;
    });

    cy.mockGewesten();
    cy.mockGemeenten();
  });

  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeFilterGemeente },
      setup() {
        const gemeenteValue = ref<IGemeente>();
        const setValue = (value: IGemeente) => (gemeenteValue.value = value);
        return { gemeenteValue, setValue };
      },
      template:
        '<OeFilterGemeente api="https://test-geo.onroerenderfgoed.be/" :value="gemeenteValue" @update:value="setValue"/>',
    });

    it('fetch gemeenten, filter and assign the chosen filter to the corresponding data value', () => {
      const onUpdateValueSpy = cy.spy().as('onUpdateValueSpy');

      cy.mount(TestComponent, { props: { 'onUpdate:value': onUpdateValueSpy } }).then(({ component }) => {
        cy.dataCy('filter-gemeente').click().find('.multiselect-search').type('Bertem');
        cy.dataCy('filter-gemeente')
          .find('.multiselect-option')
          .click()
          .then(() => {
            expect(component.gemeenteValue).to.deep.equal({
              niscode: '24009',
              naam: 'Bertem',
              provincie: {
                niscode: '20001',
              },
              status: 'inGebruik',
            });
          });

        cy.get('@onUpdateValueSpy').should('always.have.been.calledWith', {
          niscode: '24009',
          naam: 'Bertem',
          provincie: {
            niscode: '20001',
          },
          status: 'inGebruik',
        });
      });
    });
  });

  describe('gewest prop', () => {
    const TestComponent = defineComponent({
      components: { OeFilterGemeente },
      setup() {
        const gemeenteValue = ref<IGemeente>();
        const setValue = (value: IGemeente) => (gemeenteValue.value = value);
        const gewest = Niscode.VlaamsGewest;
        return { gemeenteValue, gewest, setValue };
      },
      template:
        '<OeFilterGemeente api="https://test-geo.onroerenderfgoed.be/" :value="gemeenteValue" :gewest="gewest" @update:value="setValue"/>',
    });

    it('fetches gemeenten with gewest constraint, search and assign an available gemeente', () => {
      const onUpdateValueSpy = cy.spy().as('onUpdateValueSpy');

      cy.mount(TestComponent, { props: { 'onUpdate:value': onUpdateValueSpy } }).then(({ component }) => {
        cy.dataCy('filter-gemeente').click().find('.multiselect-search').type('Bertem');
        cy.dataCy('filter-gemeente')
          .find('.multiselect-option')
          .click()
          .then(() => {
            expect(component.gemeenteValue).to.deep.equal({
              niscode: '24009',
              naam: 'Bertem',
              provincie: {
                niscode: '20001',
              },
              status: 'inGebruik',
            });
          });

        cy.get('@onUpdateValueSpy').should('always.have.been.calledWith', {
          niscode: '24009',
          naam: 'Bertem',
          provincie: {
            niscode: '20001',
          },
          status: 'inGebruik',
        });
      });
    });

    it('fetches gemeenten with gewest constraint and search for unavailable gemeente', () => {
      cy.mount(TestComponent).then(() => {
        cy.dataCy('filter-gemeente').click().find('.multiselect-search').type('Brussel');
        cy.dataCy('filter-gemeente')
          .find('.multiselect-option')
          .first()
          .should('have.text', 'Geen resultaten gevonden...');
      });
    });

    it('sorts the gemeenten by naam using filtering-sort-func', () => {
      cy.mount(TestComponent).then(() => {
        cy.dataCy('filter-gemeente').click().find('.multiselect-search').type('br');
        cy.dataCy('filter-gemeente')
          .get('.multiselect-option')
          .then(($options) => {
            const optionsText = Array.from($options)
              .filter((option) => option.offsetParent !== null)
              .map((option) => option.textContent?.trim());

            expect(optionsText).to.deep.equal([
              'Brakel',
              'Brasschaat',
              'Brecht',
              'Bredene',
              'Bree',
              'Brugge',
              'Stabroek',
              'Willebroek',
            ]);
          });
      });
    });
  });
});
