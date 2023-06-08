import FilterInput from '@components/smart/FilterInput.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import '@/scss/main.scss';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof FilterInput> = {
  title: 'Smart components/FilterInput',
  component: FilterInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        height: '400px',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterInput>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {};
