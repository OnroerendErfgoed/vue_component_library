import '@/scss/main.scss';
import FilterAOEActor from '@components/smart/FilterAOEActor.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof FilterAOEActor> = {
  title: 'Smart components/Filter Inputs/FilterAOEActor',
  component: FilterAOEActor,
  parameters: {
    docs: {
      description: {
        component:
          'Specific filter input field to enter a "wij" actor - used as subcomponent of the `FilterInput` component.\n\n All autocomplete props can also be used.',
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
      description: 'Current uri',
      table: {
        type: { summary: 'string' },
      },
    },
    api: {
      control: 'text',
      description: 'Api base url',
      table: {
        type: { summary: 'string' },
      },
    },
    getSsoToken: {
      control: 'text',
      description: 'function to get the sso Token from the parent',
      table: {
        type: { summary: 'string' },
      },
    },
    groepActoren: {
      control: 'object',
      description: 'Array of group actors to filter locally',
      table: {
        type: { summary: 'IActor[]' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder',
      table: {
        type: { summary: 'string' },
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
    id: 'my-id',
  },
  render: () => ({
    components: {
      FilterAOEActor,
    },
    setup() {
      const api = 'https://dev-actoren.onroerenderfgoed.be';
      const getSsoToken = async () => 'vul hier bearer token in';
      return { api, getSsoToken };
    },
    template: `
    <div>
      <FilterAOEActor id="my-id" :api="api" :get-sso-token="getSsoToken" />
    </div>
    `,
  }),
};

export const WithGroepActoren: Story = {
  args: {
    api: 'https://dev-actoren.onroerenderfgoed.be',
    id: 'my-id-with-groups',
  },
  render: () => ({
    components: {
      FilterAOEActor,
    },
    setup() {
      const api = 'https://dev-actoren.onroerenderfgoed.be';
      const getSsoToken = async () => 'vul hier bearer token in';
      const groepActoren = [
        { id: 1, omschrijving: 'Groep Actor 1', uri: 'group-1' },
        { id: 2, omschrijving: 'Groep Actor 2', uri: 'group-2' },
        { id: 3, omschrijving: 'Test Groep', uri: 'group-3' },
      ];
      return { api, getSsoToken, groepActoren };
    },
    template: `
    <div>
      <FilterAOEActor
        id="my-id"
        :api="api"
        :get-sso-token="getSsoToken"
        :groep-actoren="groepActoren"
      />
    </div>
    `,
  }),
};
