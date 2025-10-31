import OeClipboardCopy from '@components/core/dumb/OeClipboardCopy.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeClipboardCopy> = {
  title: 'Core/Clipboard Copy',
  component: OeClipboardCopy,
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
type Story = StoryObj<typeof OeClipboardCopy>;

export const Default: Story = {
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { OeClipboardCopy },
    template: `<OeClipboardCopy :value="args.value"></OeClipboardCopy>`,
  }),
};
