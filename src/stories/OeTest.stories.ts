import '@/scss/main.scss';
import OeTest from '@components/dumb/OeTest.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeTest> = {
  title: 'Dumb components/Test',
  component: OeTest,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OeTest>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {};
