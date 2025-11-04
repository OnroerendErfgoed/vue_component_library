import '@/scss/main.scss';
import OeButton from '@components/core/dumb/OeButton.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeButton> = {
  title: 'Core Module/Button',
  component: OeButton,
  render: (args) => ({
    components: {
      OeButton,
    },
    setup() {
      return { args };
    },
    template: `
      <oe-button v-bind="args">{{ args.default }}</oe-button>
    `,
  }),
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    default: {
      control: 'text',
      description: 'Default slot to pass in the button text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeButton>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  args: {
    default: 'My primary button',
  },
};
