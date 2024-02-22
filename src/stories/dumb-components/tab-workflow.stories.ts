import '@/scss/main.scss';
import workflow from '../../../cypress/fixtures/workflowData.json';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import TabWorkflow from '@components/dumb/TabWorkflow.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const DOSSIER_API = 'https://dev-dossiers.onroerenderfgoed.be/dossiers/158235';
const mock = new MockAdapter(axios);
const workflowUri = DOSSIER_API;
const noDataWorkflowUri = 'https://dev-dossiers.onroerenderfgoed.be/dossiers/1';
// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof TabWorkflow> = {
  title: 'Dumb components/TabWorkflow',
  component: TabWorkflow,
  parameters: {
    docs: {
      description: {
        component: `Component that shows the workflow tabs used in our process applications`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    workflowUri: {
      control: 'text',
      description: 'Uri that gets the workflow data.',
    },
    workflowSchema: {
      control: 'array',
      description: 'List of workflows to map the data against',
      table: {
        type: { summary: 'Array of workflows' },
      },
    },
    getSsoToken: {
      control: 'text',
      description: 'function to get the sso Token from the parent',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabWorkflow>;

export const Default: Story = {
  render: () => ({
    components: {
      TabWorkflow,
    },
    setup() {
      mock.onGet(DOSSIER_API).reply(200, [
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
      ]);
      const getSsoToken = async () => 1;
      return { workflowUri, workflow, getSsoToken };
    },
    template: `
    <div style="width: 100%; height: 300px">
    <TabWorkflow :workflow-uri="workflowUri" :workflow-schema="workflow" :get-sso-token="getSsoToken"></TabWorkflow>
    </div>
    `,
  }),
};

export const NoData: Story = {
  render: () => ({
    components: {
      TabWorkflow,
    },
    setup() {
      mock.onGet(noDataWorkflowUri).reply(200, []);
      const getSsoToken = async () => '1';
      return { workflowUri: noDataWorkflowUri, workflow, getSsoToken };
    },
    template: `
    <div style="width: 100%; height: 300px">
    <TabWorkflow :workflow-uri="workflowUri" :workflow-schema="workflow" :get-sso-token="getSsoToken"></TabWorkflow>
    </div>
    `,
  }),
};

export const NoWorkflowSchema: Story = {
  render: () => ({
    components: {
      TabWorkflow,
    },
    setup() {
      mock.onGet(DOSSIER_API).reply(200, [
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
      ]);
      const getSsoToken = async () => 1;
      return { workflowUri, workflow: [], getSsoToken };
    },
    template: `
    <div style="width: 100%; height: 300px">
    <TabWorkflow :workflow-uri="workflowUri" :workflow-schema="workflow" :get-sso-token="getSsoToken"></TabWorkflow>
    </div>
    `,
  }),
};
