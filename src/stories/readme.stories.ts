import ReadmeContent from '../../README.md?raw';
import MarkdownRenderer from './MarkdownRenderer.vue';
import { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof MarkdownRenderer> = {
  title: 'Documentation',
  component: MarkdownRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownRenderer>;

export const Readme: Story = {
  args: {
    content: ReadmeContent,
  },
};
