import OeActorWidget from '../components/smart/OeActorWidget.vue';
import { defineComponent } from 'vue';

describe('OeActorWidget', () => {
  describe('default', () => {
    const TestComponent = defineComponent({
      components: { OeActorWidget },
      setup() {
        const id = '1';
        const api = 'https://dev-actoren.onroerenderfgoed.be';
        const getSsoToken = async () => 1;
        return { id, api, getSsoToken };
      },
      template: `
      <oe-actor-widget :id="id" :api="api" :get-sso-token="getSsoToken" :open="true">
        <template v-slot:dropdown>
          <div class="dropdown"></div>
        </template>
      </oe-actor-widget>
      `,
    });

    it('fetches actoren and shows a grid on startup', () => {
      cy.intercept('GET', 'https://dev-actoren.onroerenderfgoed.be/**', { fixture: 'actoren.json' }).as('dataGet');

      cy.mount(TestComponent);
    });
  });
});
