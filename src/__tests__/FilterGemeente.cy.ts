/* eslint-disable vue/one-component-per-file */
import FilterGemeente from '../components/smart/FilterGemeente.vue';
import { defineComponent, ref } from 'vue';
import { Niscode } from '@models/niscode.enum';
import type { IGemeente } from '@models/locatie';

describe('FilterGemeente', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { FilterGemeente },
      setup() {
        const gemeenteValue = ref<IGemeente>();
        const setValue = (value: IGemeente) => (gemeenteValue.value = value);
        return { gemeenteValue, setValue };
      },
      template:
        '<filter-gemeente api="https://test-geo.onroerenderfgoed.be/" :value="gemeenteValue" @update:value="setValue"/>',
    });

    beforeEach(() => cy.mockAdressenregister());

    it('fetch gemeenten, filter and assign the chosen filter to the corresponding data value', () => {
      const onUpdateValueSpy = cy.spy().as('onUpdateValueSpy');

      cy.mount(TestComponent, { props: { 'onUpdate:value': onUpdateValueSpy } }).then(({ component }) => {
        cy.dataCy('filter-gemeente').click().find('.multiselect__input').type('Bertem');
        cy.dataCy('filter-gemeente')
          .find('.multiselect__element')
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
      components: { FilterGemeente },
      setup() {
        const gemeenteValue = ref<IGemeente>();
        const setValue = (value: IGemeente) => (gemeenteValue.value = value);
        const gewest = Niscode.VlaamsGewest;
        return { gemeenteValue, gewest, setValue };
      },
      template:
        '<filter-gemeente api="https://test-geo.onroerenderfgoed.be/" :value="gemeenteValue" :gewest="gewest" @update:value="setValue"/>',
    });

    beforeEach(() => cy.mockAdressenregister());

    it('fetches gemeenten with gewest constraint, search and assign an available gemeente', () => {
      const onUpdateValueSpy = cy.spy().as('onUpdateValueSpy');

      cy.mount(TestComponent, { props: { 'onUpdate:value': onUpdateValueSpy } }).then(({ component }) => {
        cy.dataCy('filter-gemeente').click().find('.multiselect__input').type('Bertem');
        cy.dataCy('filter-gemeente')
          .find('.multiselect__element')
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
        cy.dataCy('filter-gemeente').click().find('.multiselect__input').type('Brussel');
        cy.dataCy('filter-gemeente')
          .find('.multiselect__option span')
          .first()
          .should('have.text', 'Geen resultaten gevonden...');
      });
    });

    it('sorts the gemeenten by naam using filtering-sort-func', () => {
      cy.mount(TestComponent).then(() => {
        cy.dataCy('filter-gemeente').click().find('.multiselect__input').type('br');
        cy.dataCy('filter-gemeente')
          .get('.multiselect__option span')
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
