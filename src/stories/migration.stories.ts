import MigrationContent from '../../MIGRATION.md?raw';
import MarkdownRenderer from './MarkdownRenderer.vue';
import { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof MarkdownRenderer> = {
  title: 'Documentation/Migration',
  component: MarkdownRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownRenderer>;

export const Migration: Story = {
  args: {
    content: MigrationContent,
  },
};
