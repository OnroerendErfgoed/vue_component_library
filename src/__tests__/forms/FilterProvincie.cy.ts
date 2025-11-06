import { defineComponent, ref } from 'vue';
import { OeFilterProvincie } from '@components/forms';
import type { IProvincie } from '@models/locatie';

describe('FilterProvincie', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      // Ignore errors from chunk files (bundled external libraries)
      if (err.message.includes('chunk-') || err.stack?.includes('chunk-')) {
        return false;
      }
      return true;
    });
  });

  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeFilterProvincie },
      setup() {
        const provincieValue = ref<IProvincie>();
        const setValue = (value: IProvincie) => (provincieValue.value = value);
        return { provincieValue, setValue };
      },
      template:
        '<OeFilterProvincie api="https://test-geo.onroerenderfgoed.be/" :value="provincieValue" @update:value="setValue"/>',
    });

    beforeEach(() => {
      cy.mockLanden();
      cy.mockGewesten();
      cy.mockProvincies();
    });

    it('fetch provincies, filter and assign the chosen filter to the corresponding data value', () => {
      const onUpdateValueSpy = cy.spy().as('onUpdateValueSpy');

      cy.mount(TestComponent, { props: { 'onUpdate:value': onUpdateValueSpy } }).then(({ component }) => {
        cy.wait('@dataGetProvinciesVlaamsGewest').then(() => {
          cy.dataCy('filter-provincie').click().find('.multiselect-search').type('vlaams');
          cy.dataCy('filter-provincie')
            .find('.multiselect-option')
            .click()
            .then(() => {
              expect(component.provincieValue).to.deep.equal({
                niscode: '20001',
                naam: 'Vlaams-Brabant',
                gewest: {
                  niscode: '2000',
                },
              });
            });

          cy.get('@onUpdateValueSpy').should('always.have.been.calledWith', {
            niscode: '20001',
            naam: 'Vlaams-Brabant',
            gewest: {
              niscode: '2000',
            },
          });
        });
      });
    });
  });
});
