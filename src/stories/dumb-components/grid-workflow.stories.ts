import '@/scss/main.scss';
import schema from '../../../cypress/fixtures/workflowSchema.json';
import GridWorkflow from '@components/dumb/GridWorkflow.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof GridWorkflow> = {
  title: 'Dumb components/GridWorkflow',
  component: GridWorkflow,
  parameters: {
    docs: {
      description: {
        component: `Component that shows the workflow grid used in our process applications`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'array',
      description: 'Workflow data',
    },
    schema: {
      control: 'array',
      description: 'Schemas for the dossier',
      table: {
        type: { summary: 'Array of workflows' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GridWorkflow>;

export const Default: Story = {
  render: () => ({
    components: {
      GridWorkflow,
    },
    setup() {
      const data = [
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
      return { data, schema };
    },
    template: `
    <GridWorkflow :data="data" :schema="schema"></GridWorkflow>
    `,
  }),
};

export const NoData: Story = {
  render: () => ({
    components: {
      GridWorkflow,
    },
    setup() {
      return { data: [], schema };
    },
    template: `
    <GridWorkflow data:="data" :schema="schema"></GridWorkflow>
    `,
  }),
};

export const NoSchema: Story = {
  render: () => ({
    components: {
      GridWorkflow,
    },
    setup() {
      const data = [
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
      return { data: data, schema: [] };
    },
    template: `
    <GridWorkflow :data="data" :schema="schema"></GridWorkflow>
    `,
  }),
};
