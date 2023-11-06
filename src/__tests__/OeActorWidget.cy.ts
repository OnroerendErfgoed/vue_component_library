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

    beforeEach(() => {
      cy.intercept('GET', 'https://dev-actoren.onroerenderfgoed.be/**', {
        fixture: 'actoren.json',
        headers: {
          'Content-Range': 'items 0-50/1',
        },
      }).as('dataGet');
    });

    it('fetches actoren and shows a grid on startup', () => {
      cy.mount(TestComponent).then(() => {
        cy.wait('@dataGet');
        cy.dataCy('ag-grid-vue').find('.ag-center-cols-container').children().should('have.length', 1);
      });
    });

    it('enables the add button when a row is clicked', () => {
      cy.mount(TestComponent).then(() => {
        cy.wait('@dataGet');
        cy.dataCy('ag-grid-vue').find('.ag-center-cols-container').children().first().click();
        cy.dataCy('actor-widget-add-btn').should('be.enabled');
      });
    });
  });
});
