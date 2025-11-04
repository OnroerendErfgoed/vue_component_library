import { ref } from 'vue';
import { OeFilterRadio } from '@/forms';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeFilterRadio> = {
  title: 'Forms Module/Filter Inputs/Filter Radio',
  component: OeFilterRadio,
  parameters: {
    docs: {
      description: {
        component:
          'Generic filter input field to enter a radio input - used as subcomponent of the `OeFilter` component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique id',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: 'Current value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    options: {
      control: 'array',
      description: 'List of radio options',
      table: {
        type: { summary: 'IOption[]' },
        defaultValue: { summary: '[]' },
      },
    },
    'update:value': {
      description: 'Emits the selected value',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeFilterRadio>;

export const Default: Story = {
  render: () => ({
    components: { OeFilterRadio },
    setup() {
      const value = ref();
      const options = [
        {
          label: 'Ja',
          value: true,
        },
        {
          label: 'Nee',
          value: false,
        },
      ];
      const setValue = (e) => {
        value.value = e;
      };

      return { options, value, setValue };
    },
    template: `<oe-filter-radio id="we" :value="value" @update:value="setValue($event.value)" :options="options"> </oe-filter-radio>`,
  }),
};
