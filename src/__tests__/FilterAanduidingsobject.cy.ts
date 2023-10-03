import FilterAanduidingsobject from '../components/smart/FilterAanduidingsobject.vue';
import { defineComponent, ref } from 'vue';
import type { IESAanduidingsobject } from '@models/aanduidingsobject';

describe('FilterAanduidingsobject', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { FilterAanduidingsobject },
      setup() {
        const aanduidingsobjectValue = ref<IESAanduidingsobject>();
        const setValue = (value: IESAanduidingsobject) => (aanduidingsobjectValue.value = value);
        return { aanduidingsobjectValue, setValue };
      },
      template:
        '<filter-aanduidingsobject api="https://dev-inventaris.onroerenderfgoed.be/" :value="aanduidingsobjectValue" @update:value="setValue"/>',
    });

    it('fetch aanduidingsobjecten, filter and assign the chosen filter to the corresponding data value', () => {
      cy.intercept('GET', 'https://dev-inventaris.onroerenderfgoed.be/**', { fixture: 'aanduidingsobjecten.json' }).as(
        'dataGet'
      );

      cy.mount(TestComponent).then(({ component }) => {
        cy.dataCy('filter-aanduidingsobject').type('Aanduidingsobject test');
        cy.wait('@dataGet').then(() => {
          cy.dataCy('filter-aanduidingsobject')
            .find('.vl-autocomplete__cta')
            .first()
            .click()
            .then(() => {
              expect(component.aanduidingsobjectValue).to.deep.equal({
                title: 'Aanduidingsobject test (id: 10)',
                value: 'https://dev-id.erfgoed.net/aanduidingsobjecten/10',
              });
            });
        });
      });
    });
  });
});
