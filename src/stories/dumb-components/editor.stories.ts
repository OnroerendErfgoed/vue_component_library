import '@/scss/main.scss';
import { ref } from 'vue';
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
  argTypes: {
    modelValue: {
      description: 'HTML input',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeEditor>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  render: () => ({
    components: {
      OeEditor,
    },
    setup() {
      const model = ref('<p>Hello Quilly!</p>');
      return { model };
    },
    template: `
      <oe-editor id="editor-1" v-model="model" />

      <br />
      <h5>Output</h5>
      <p class="vl-u-spacer-top vl-u-spacer-bottom--large">{{ model }}</p>
    `,
  }),
};
