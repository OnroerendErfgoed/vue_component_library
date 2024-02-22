import workflow from '../../cypress/fixtures/workflowData.json';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mount } from 'cypress/vue';
import { defineComponent, useAttrs } from 'vue';
import TabWorkflow from '@components/dumb/TabWorkflow.vue';

const noDataWorkflowUri = 'https://dev-dossiers.onroerenderfgoed.be/dossiers/1';
const dossiersUri = 'https://dev-dossiers.onroerenderfgoed.be/dossiers/158235';

const dossiersReply = [
  {
    actor: 'https://dev-id.erfgoed.net/actoren/12653',
    datum: '2024-01-09T10:39:15.996776+01:00',
    state: {
      id: 0,
    },
    owners: [
      {
        id: 'https://dev-id.erfgoed.net/actoren/12564',
        type: 'actor',
        omschrijving: 'Van Humbeeck, Astrid',
      },
    ],
    actor_omschrijving: 'Proces energieadvies',
  },
  {
    actor: 'https://dev-id.erfgoed.net/actoren/12618',
    datum: '2024-01-09T15:51:43.786767+01:00',
    state: {
      id: 1,
      comment: 'Test',
      state_qualifier: 1,
    },
    owners: [
      {
        id: 'https://dev-id.erfgoed.net/actoren/12564',
        type: 'actor',
        omschrijving: 'Van Humbeeck, Astrid',
      },
    ],
    actor_omschrijving: 'Adriaens, Wouter',
  },
];
const getSsoToken = async () => 1;
const mock = new MockAdapter(axios);

const TestComponent = defineComponent({
  components: { TabWorkflow },
  setup() {
    const attrs = useAttrs();
    return { attrs };
  },
  template: `<div style="width: 100%; height: 300px">
  <TabWorkflow v-bind="attrs"></TabWorkflow>
  </div>`,
});

describe('TabWorkflow - no data', () => {
  mock.onGet(noDataWorkflowUri).reply(200, []);
  it('renders', () => {
    mount(TestComponent, { props: { workflowUri: noDataWorkflowUri, workflowSchema: [], getSsoToken: getSsoToken } });
  });

  it('shows the correct no rows melding', () => {
    mount(TestComponent, { props: { workflowUri: noDataWorkflowUri, workflowSchema: [], getSsoToken: getSsoToken } });
    cy.dataCy('ag-overlay').invoke('text').should('contain', 'Er zijn nog geen workflows beschikbaar');
  });
});

describe('TabWorkflow - data', () => {
  mock.onGet(dossiersUri).reply(200, dossiersReply);
  it('renders', () => {
    mount(TestComponent, {
      props: { workflowUri: dossiersUri, workflowSchema: workflow, getSsoToken: getSsoToken },
    });
  });

  it('renders 2 rows', () => {
    mount(TestComponent, {
      props: { workflowUri: dossiersUri, workflowSchema: workflow, getSsoToken: getSsoToken },
    });
    cy.dataCy('ag-grid-vue').find('.ag-center-cols-container').children().should('have.length', 2);
  });
});
