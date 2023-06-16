/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import FilterGemeente from '../components/smart/FilterGemeente.vue';
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
        '<filter-gemeente api="https://dev-geo.onroerenderfgoed.be/" :value="gemeenteValue" @update:value="setValue"/>',
    });

    it('fetch gemeenten, filter and assign the chosen filter to the corresponding data value', () => {
      cy.mount(TestComponent).then(({ component }) => {
        cy.intercept({ method: 'GET', url: 'https://dev-geo.onroerenderfgoed.be/**' }).as('dataGet');
        cy.wait('@dataGet').then(() => {
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
              });
            });
        });
      });
    });
  });
});
