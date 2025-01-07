import FilterGemeente from '../components/smart/FilterGemeente.vue';
import { defineComponent, ref } from 'vue';
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
        cy.wait('@dataGetGemeentenVlaamsGewest').then(() => {
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
  });
});
