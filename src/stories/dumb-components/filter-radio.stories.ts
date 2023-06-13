import type { Meta, StoryObj } from '@storybook/vue3';
import FilterRadio from '../../components/dumb/FilterRadio.vue';

import '@/scss/main.scss';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof FilterRadio> = {
  title: 'Dumb components/Filter Inputs/FilterRadio',
  component: FilterRadio,
  parameters: {
    docs: {
      description: {
        component:
          'Generic filter input field to enter a radio input - used as subcomponent of the `FilterInput` component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
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
type Story = StoryObj<typeof FilterRadio>;

export const Default: Story = {
  args: {
    options: [
      {
        label: 'Ja',
        value: 'ja',
      },
      {
        label: 'Nee',
        value: 'nee',
      },
    ],
  },
};
