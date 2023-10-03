import '@/scss/main.scss';
import FilterAanduidingsobject from '../../components/smart/FilterAanduidingsobject.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof FilterAanduidingsobject> = {
  title: 'Smart components/Filter Inputs/FilterAanduidingsobject',
  component: FilterAanduidingsobject,
  parameters: {
    docs: {
      description: {
        component:
          'Specific filter input field to enter an aanduidingsobject - used as subcomponent of the `FilterInput` component.\n\n All autocomplete props can also be used.',
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
    placeholder: {
      control: 'text',
      description: 'Input placeholder',
      table: {
        type: { summary: 'string' },
      },
    },
    'update:value': {
      description: 'Emits the selected aanduidingsobject',
      table: {
        type: { summary: 'IAanduidingsobject' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterAanduidingsobject>;

export const Default: Story = {
  args: {
    api: 'https://dev-inventaris.onroerenderfgoed.be/',
    id: 'my-id',
  },
};
