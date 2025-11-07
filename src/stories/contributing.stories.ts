import ContributingContent from '../../CONTRIBUTING.md?raw';
import MarkdownRenderer from './MarkdownRenderer.vue';
import { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof MarkdownRenderer> = {
  title: 'Documentation/Contributing',
  component: MarkdownRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownRenderer>;

export const Contributing: Story = {
  args: {
    content: ContributingContent,
  },
};
