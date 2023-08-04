import type { Meta, StoryObj } from '@storybook/vue3';
import FilterGemeente from '../../components/smart/FilterGemeente.vue';

import '@/scss/main.scss';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof FilterGemeente> = {
  title: 'Smart components/Filter Inputs/FilterGemeente',
  component: FilterGemeente,
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
      description: 'Emits the selected gemeente',
      table: {
        type: { summary: 'IGemeente' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterGemeente>;

export const Default: Story = {
  args: {
    api: 'https://test-geo.onroerenderfgoed.be/',
  },
};
