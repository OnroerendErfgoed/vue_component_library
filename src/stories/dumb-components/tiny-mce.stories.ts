import '@/scss/main.scss';
import OeTinyMce from '../../components/dumb/OeTinyMCE.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeTinyMce> = {
  title: 'Dumb components/TinyMce',
  component: OeTinyMce,
  parameters: {
    docs: {
      description: {
        component:
          'Generic filter input field to enter a date input - used as subcomponent of the `FilterInput` component.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OeTinyMce>;

export const Default: Story = {};