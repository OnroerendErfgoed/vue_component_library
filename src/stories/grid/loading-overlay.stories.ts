import OeGridLoadingOverlay from '@components/grid/dumb/OeGridLoadingOverlay.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeGridLoadingOverlay> = {
  title: 'Grid Module/Loading Overlay',
  component: OeGridLoadingOverlay,
  tags: ['autodocs'],
  argTypes: {
    params: { control: 'object' },
  },
  args: {
    params: {
      loadingMessage: 'Loading...',
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeGridLoadingOverlay>;

export const Default: Story = {};
