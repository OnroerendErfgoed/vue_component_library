import OeGridNoRowsOverlay from '@components/grid/dumb/OeGridNoRowsOverlay.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeGridNoRowsOverlay> = {
  title: 'Grid/No Rows Overlay',
  component: OeGridNoRowsOverlay,
  tags: ['autodocs'],
  argTypes: {
    params: { control: 'object' },
  },
  args: {
    params: {
      noRowsMessage: 'No rows available',
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeGridNoRowsOverlay>;

export const Default: Story = {};
