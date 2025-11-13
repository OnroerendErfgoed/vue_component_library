import { OeFilterText } from '@/forms';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeFilterText> = {
  title: 'Forms Module/Filter Inputs/Filter Text',
  component: OeFilterText,
  parameters: {
    docs: {
      description: {
        component:
          'Generic filter input field to enter a text input - used as subcomponent of the `OeFilter` component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Text value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    'update:value': {
      description: 'Emits the text value',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeFilterText>;

export const Default: Story = {};
