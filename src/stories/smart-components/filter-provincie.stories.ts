import type { Meta, StoryObj } from '@storybook/vue3';
import FilterProvincie from '../../components/smart/FilterProvincie.vue';

import '@/scss/main.scss';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof FilterProvincie> = {
  title: 'Smart components/Filter Inputs/FilterProvincie',
  component: FilterProvincie,
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
};

export default meta;
type Story = StoryObj<typeof FilterProvincie>;

export const Default: Story = {
  args: {
    api: 'https://test-geo.onroerenderfgoed.be/',
  },
};
