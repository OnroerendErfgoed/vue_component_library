import OeHeader from '@components/dumb/OeHeader.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import '@/scss/main.scss';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeHeader> = {
  title: 'Dumb components/Header',
  component: OeHeader,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OeHeader>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  parameters: {
    docs: {
      story: {
        height: '250px',
      },
    },
  },
};
