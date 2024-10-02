import '@/scss/main.scss';
import OeEditor from '@components/dumb/OeEditor.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeEditor> = {
  title: 'Dumb components/Editor',
  component: OeEditor,
  render: (args) => ({
    components: {
      OeEditor,
    },
    setup() {
      return { args };
    },
    template: `
      <oe-editor/>
    `,
  }),
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OeEditor>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {};
