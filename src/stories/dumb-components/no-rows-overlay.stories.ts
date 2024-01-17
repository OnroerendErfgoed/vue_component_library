import type { Meta, StoryObj } from '@storybook/vue3';
import NoRowsOverlay from '@components/dumb/NoRowsOverlay.vue';

const meta: Meta<typeof NoRowsOverlay> = {
  title: 'Dumb components/NoRowsOverlay',
  component: NoRowsOverlay,
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
type Story = StoryObj<typeof NoRowsOverlay>;

export const Default: Story = {};
