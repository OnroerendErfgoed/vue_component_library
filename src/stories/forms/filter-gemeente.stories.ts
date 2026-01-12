import OeFilterGemeente from '@components/forms/smart/OeFilterGemeente.vue';
import { Niscode } from '@models/niscode.enum';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { IGemeente } from '@models/locatie';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeFilterGemeente> = {
  title: 'Forms Module/Filter Inputs/Filter Gemeente',
  component: OeFilterGemeente,
  parameters: {
    docs: {
      description: {
        component:
          'Specific filter input field to enter a gemeente - used as subcomponent of the `FilterInput` component.',
      },
      story: {
        height: '400px',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    gewest: {
      control: 'text',
      description: 'Gewest niscode',
      table: {
        type: { summary: 'Niscode' },
        defaultValue: { summary: undefined },
      },
    },
    value: {
      control: 'text',
      description: 'Current niscode',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    api: {
      control: 'text',
      description: 'Api base url',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    'update:value': {
      description: 'Emits the selected gemeente',
      table: {
        type: { summary: 'IGemeente' },
      },
    },
  },
  render: (args) => ({
    components: { OeFilterGemeente },
    inheritAttrs: false,
    setup() {
      return { args };
    },
    template: `
      <div>
      <Suspense>
        <OeFilterGemeente v-bind="args" @update:value="onUpdateGemeente" />
      </Suspense>
      </div>
    `,
    methods: {
      onUpdateGemeente(payload: IGemeente) {
        args.value = payload.niscode;
      },
    },
  }),
};

export default meta;
type Story = StoryObj<typeof OeFilterGemeente>;

export const Default: Story = {
  args: {
    api: 'https://test-geo.onroerenderfgoed.be/',
  },
};

export const WithGewestConstraint: Story = {
  args: {
    api: 'https://test-geo.onroerenderfgoed.be/',
    gewest: Niscode.VlaamsGewest,
  },
};
