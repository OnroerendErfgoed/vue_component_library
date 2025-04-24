import '@/scss/main.scss';
import { VlTextarea } from '@govflanders/vl-ui-design-system-vue3';
import { vAutoResizeTextarea } from '@directives/auto-resize-textarea.directive';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta = {
  title: 'Directives/AutoResizeTextarea',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    components: {
      VlTextarea,
    },
    directives: {
      autoResizeTextarea: vAutoResizeTextarea,
    },
    template: `<VlTextarea v-auto-resize-textarea mod-block />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'This directive automatically resizes the textarea to fit its content. It listens for input events and adjusts the height of the textarea accordingly.',
      },
    },
  },
};

export const InitialContent: Story = {
  render: () => ({
    components: {
      VlTextarea,
    },
    directives: {
      autoResizeTextarea: vAutoResizeTextarea,
    },
    setup() {
      const content =
        'This is some initial content that will be used to resize the textarea on mount. It should be long enough to trigger the auto-resize functionality. Make sure to test it with different lengths of content to see how it behaves. This is a test to see if the textarea resizes correctly. It should adjust its height based on the content inside it. This is a test to see if the textarea resizes correctly. It should adjust its height based on the content inside it. This is a test to see if the textarea resizes correctly. It should adjust its height based on the content inside it.';
      return { content };
    },
    template: `<VlTextarea v-auto-resize-textarea mod-block :model-value="content" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'The textarea will resize to fit the content on mount.',
      },
    },
  },
};
