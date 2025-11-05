import OeFilterProvincie from '@components/forms/smart/OeFilterProvincie.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import type { IProvincie } from '@models/locatie';

const meta: Meta<typeof OeFilterProvincie> = {
  title: 'Forms Module/Filter Inputs/Filter Provincie',
  component: OeFilterProvincie,
  parameters: {
    docs: {
      description: {
        component:
          'Specific filter input field to enter a provincie - used as subcomponent of the `FilterInput` component.',
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
      description: 'Current niscode',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
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
      description: 'Emits the selected provincie',
      table: {
        type: { summary: 'IProvincie' },
      },
    },
  },
  render: (args) => ({
    components: { OeFilterProvincie },
    inheritAttrs: false,
    setup() {
      return { args };
    },
    template: `
      <div>
      <Suspense>
        <OeFilterProvincie v-bind="args" @update:value="onUpdateProvincie" />
      </Suspense>
      </div>
    `,
    methods: {
      onUpdateProvincie(payload: IProvincie) {
        args.value = payload.niscode;
      },
    },
  }),
};

export default meta;
type Story = StoryObj<typeof OeFilterProvincie>;

export const Default: Story = {
  args: {
    api: 'https://test-geo.onroerenderfgoed.be/',
  },
};
