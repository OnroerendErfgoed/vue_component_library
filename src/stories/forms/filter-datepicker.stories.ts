import { OeFilterDatepicker } from '@components/forms';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeFilterDatepicker> = {
  title: 'Forms Module/Filter Inputs/Filter Datepicker',
  component: OeFilterDatepicker,
  parameters: {
    docs: {
      description: {
        component:
          'Generic filter input field to enter a date input - used as subcomponent of the `OeFilter` component.',
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
type Story = StoryObj<typeof OeFilterDatepicker>;

export const Default: Story = {};
