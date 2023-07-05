import InputPhone from '../../components/dumb/InputPhone.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import '@/scss/main.scss';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof InputPhone> = {
  title: 'Dumb components/InputPhone',
  component: InputPhone,
  parameters: {
    docs: {
      story: {
        height: '350px',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InputPhone>;

export const Default: Story = {};
