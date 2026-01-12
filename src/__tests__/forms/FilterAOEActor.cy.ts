import { defineComponent, ref } from 'vue';
import { OeFilterAOEActor } from '@components/forms';
import type { IActor } from '@models/actor';

describe('FilterAanduidingsobject', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeFilterAOEActor },
      setup() {
        const actorValue = ref<IActor>();
        const setValue = (value: IActor) => (actorValue.value = value);
        const getSsoToken = async () => 'Bearer ' + 1;
        return { actorValue, setValue, getSsoToken };
      },
      template:
        '<OeFilterAOEActor api="https://dev-actoren.onroerenderfgoed.be" :get-sso-token="getSsoToken" :value="actorValue" @update:value="setValue"/>',
    });

    it('fetches wij actoren, filter and assign the chosen filter to the corresponding data value', () => {
      cy.intercept('GET', 'https://dev-actoren.onroerenderfgoed.be/**', { fixture: 'actoren.json' }).as('dataGet');

      cy.mount(TestComponent).then(({ component }) => {
        cy.dataCy('filter-actor').type('Astrid');
        cy.wait('@dataGet').then(() => {
          cy.dataCy('filter-actor')
            .find('.vl-autocomplete__cta')
            .first()
            .click()
            .then(() => {
              expect(component.actorValue).to.deep.equal({
                title: 'Van Humbeeck, Astrid',
                value: 'https://dev-id.erfgoed.net/actoren/12564',
              });
            });
        });
      });
    });
  });
});
