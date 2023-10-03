import '@/scss/main.scss';
import FilterDatepicker from '../../components/dumb/FilterDatepicker.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof FilterDatepicker> = {
  title: 'Dumb components/Filter Inputs/FilterDatepicker',
  component: FilterDatepicker,
  parameters: {
    docs: {
      description: {
        component:
          'Generic filter input field to enter a date input - used as subcomponent of the `FilterInput` component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'array',
      description: 'List of date values',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' },
      },
    },
    'update:value': {
      description: 'Emits the selected date',
      table: {
        type: { summary: 'string[]' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterDatepicker>;

export const Default: Story = {};
