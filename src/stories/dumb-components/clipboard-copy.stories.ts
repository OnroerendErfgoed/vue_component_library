import type { Meta, StoryObj } from '@storybook/vue3';
import ClipboardCopy from '../../components/dumb/ClipboardCopy.vue';

const meta: Meta<typeof ClipboardCopy> = {
  title: 'Dumb components/ClipboardCopy',
  component: ClipboardCopy,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
  },
  args: {
    value: 'https://dev-id.erfgoed.net/erfgoedobjecten/10',
  },
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `<Clipboard-copy></Clipboard-copy>`,
  }),
};

export default meta;
type Story = StoryObj<typeof ClipboardCopy>;

export const Default: Story = {
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { ClipboardCopy },
    template: `<Clipboard-copy :value="args.value"></Clipboard-copy>`,
  }),
};
