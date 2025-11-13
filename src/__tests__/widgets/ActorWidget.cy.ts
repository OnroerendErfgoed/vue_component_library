/* eslint-disable vue/one-component-per-file */
import {
  CellStyleModule,
  ColumnAutoSizeModule,
  InfiniteRowModelModule,
  ModuleRegistry,
  RowSelectionModule,
  ValidationModule,
} from 'ag-grid-community';
import { Interception } from 'cypress/types/net-stubbing';
import { defineComponent } from 'vue';
import { OeActorWidget } from '@components/widgets';
import { ActorType } from '@models/actor';

ModuleRegistry.registerModules([
  InfiniteRowModelModule,
  ValidationModule,
  ColumnAutoSizeModule,
  RowSelectionModule,
  CellStyleModule,
]);

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
          <div data-cy="actor-widget-slot-dropdown">Test</div>
        </template>
      </oe-actor-widget>
      `,
    });

    beforeEach(() => {
      cy.intercept('GET', 'https://dev-actoren.onroerenderfgoed.be/actoren*', {
        fixture: 'actoren.json',
        headers: {
          'Content-Range': 'items 0-50/1',
        },
      }).as('dataGet');
      cy.intercept('GET', 'https://dev-actoren.onroerenderfgoed.be/actoren/**', {
        fixture: 'actor.json',
      }).as('dataSingleGet');

      cy.mount(TestComponent);
      cy.wait('@dataGet');
    });

    it('fetches actoren and shows a grid on startup', () => {
      cy.dataCy('ag-grid-vue').find('.ag-center-cols-container').children().should('have.length', 1);
    });

    it('enables the add button when a row is clicked', () => {
      cy.dataCy('ag-grid-vue').find('.ag-center-cols-container').children().first().click();
      cy.dataCy('actor-widget-add-btn').should('be.enabled');
    });

    it('shows the provided dropdown slot template', () => {
      cy.dataCy('actor-widget-slot-dropdown').should('have.text', 'Test');
    });

    it('opens the detail view after click on eye-icon and closes again after click on back btn', () => {
      cy.dataCy('actor-widget-detail-btn').click();
      cy.wait('@dataSingleGet');
      cy.dataCy('actor-widget-detail').should('exist');
      cy.dataCy('actor-widget-detail-back-btn').click();
      cy.dataCy('actor-widget-grid').should('exist');
    });

    it('opens the detail view after click on eye-icon and preserves search after click on back btn', () => {
      cy.dataCy('actor-widget-menu-search').type('astrid').type('{enter}');
      cy.dataCy('actor-widget-detail-btn').click();
      cy.wait('@dataSingleGet');
      cy.dataCy('actor-widget-detail-back-btn').click();
      cy.dataCy('actor-widget-menu-search').find('input').should('have.value', 'astrid');
    });
  });

  describe('filter by actor type', () => {
    const TestComponent = defineComponent({
      components: { OeActorWidget },
      setup() {
        const actorType = ActorType.ORGANISATIE;
        const id = '1';
        const api = 'https://dev-actoren.onroerenderfgoed.be';
        const getSsoToken = async () => 1;
        return { id, api, getSsoToken, actorType };
      },
      template: `
      <oe-actor-widget :id="id" :api="api" :get-sso-token="getSsoToken" :open="true" :actor-type="actorType">
        <template v-slot:dropdown>
          <div data-cy="actor-widget-slot-dropdown">Test</div>
        </template>
      </oe-actor-widget>
      `,
    });

    beforeEach(() => {
      cy.intercept('GET', 'https://dev-actoren.onroerenderfgoed.be/actoren*', {
        fixture: 'actoren.json',
        headers: {
          'Content-Range': 'items 0-50/1',
        },
      }).as('dataGet');

      cy.mount(TestComponent);
      cy.wait('@dataGet');
    });

    it('adds a type queryparam to the get request', () => {
      cy.get('@dataGet').then((interception) => {
        expect((interception as unknown as Interception).request.query).to.deep.equal({
          type: 'foaf:Organization',
          geldige_actor: 'true',
        });
      });
    });
  });

  describe('disabled add button', () => {
    const TestComponent = defineComponent({
      components: { OeActorWidget },
      setup() {
        const disableAddButton = true;
        const id = '1';
        const api = 'https://dev-actoren.onroerenderfgoed.be';
        const getSsoToken = async () => 1;
        return { id, api, getSsoToken, disableAddButton };
      },
      template: `
      <oe-actor-widget :id="id" :api="api" :get-sso-token="getSsoToken" :open="true" :disable-add-button="disableAddButton">
        <template v-slot:dropdown>
          <div data-cy="actor-widget-slot-dropdown">Test</div>
        </template>
      </oe-actor-widget>
      `,
    });

    beforeEach(() => {
      cy.intercept('GET', 'https://dev-actoren.onroerenderfgoed.be/actoren*', {
        fixture: 'actoren.json',
        headers: {
          'Content-Range': 'items 0-50/1',
        },
      }).as('dataGet');

      cy.mount(TestComponent);
      cy.wait('@dataGet');
    });

    it('disables the add button', () => {
      cy.dataCy('ag-grid-vue').find('.ag-center-cols-container').children().first().click();
      cy.dataCy('actor-widget-add-btn').should('be.disabled');
    });
  });
});
