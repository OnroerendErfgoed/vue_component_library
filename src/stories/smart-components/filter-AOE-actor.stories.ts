import '@/scss/main.scss';
import FilterAOEActor from '@components/smart/FilterAOEActor.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { IActor } from '@models/actor';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof FilterAOEActor> = {
  title: 'Smart components/Filter Inputs/FilterAOEActor',
  component: FilterAOEActor,
  parameters: {
    docs: {
      description: {
        component:
          'Specific filter input field to enter an actor - used as subcomponent of the `FilterInput` component.',
      },
      story: {
        height: '400px',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Actor omschrijving',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    api: {
      control: 'text',
      description: 'Actor Api base url',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    'update:value': {
      description: 'Emits the selected actor',
      table: {
        type: { summary: 'IActor' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterAOEActor>;

export const Default: Story = {
  args: {
    api: 'https://dev-actoren.onroerenderfgoed.be',
    actoren: [
      {
        id: 12577,
        uri: 'https://dev-id.erfgoed.net/actoren/12577',
        self: 'https://dev-actoren.onroerenderfgoed.be/actoren/12577',
        type: {
          id: 1,
          naam: 'persoon',
          uri: 'foaf:Person',
        },
        zichtbaarheid: {
          id: 1,
          naam: 'privaat',
        },
        omschrijving: 'Actoren, Slecht',
        naam: 'Actoren',
        voornaam: 'Slecht',
        status: {
          id: 10,
          status: 'Klad',
        },
        systemfields: {
          created_at: '2021-06-02T09:08:19.119287+02:00',
          created_by: {
            uri: 'https://dev-id.erfgoed.net/actoren/12564',
            description: 'Van Humbeeck, Astrid',
          },
          updated_at: '2023-05-05T13:12:06.836065+02:00',
          updated_by: {
            uri: 'https://dev-id.erfgoed.net/actoren/12564',
            description: 'Van Humbeeck, Astrid',
          },
        },
      },
      {
        id: 502,
        uri: 'https://dev-id.erfgoed.net/actoren/502',
        self: 'https://dev-actoren.onroerenderfgoed.be/actoren/502',
        type: {
          id: 2,
          naam: 'organisatie',
          uri: 'foaf:Organization',
        },
        zichtbaarheid: {
          id: 2,
          naam: 'publiek',
        },
        omschrijving: 'Agentschap Ruimte en Erfgoed (R&E)',
        naam: 'Agentschap Ruimte en Erfgoed',
        voornaam: '',
        status: {
          id: 10,
          status: 'Klad',
        },
        systemfields: {
          created_at: '2007-10-22T10:10:32+02:00',
          created_by: {
            uri: 'https://id.erfgoed.net/actoren/5',
            description: 'Hooft, Elise',
          },
          updated_at: '2023-08-21T09:05:41.144120+02:00',
          updated_by: {
            uri: 'https://dev-id.erfgoed.net/actoren/10078',
            description: 'Inventaris',
          },
        },
      },
    ] as IActor[],
  },
};
