import '@/scss/main.scss';
import { ref } from 'vue';
import OeEditor from '@components/dumb/OeEditor.vue';
import { type OeEditorToolbarConfig } from '@models/editor';
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

export const FulloptionToolbar: Story = {
  parameters: {
    docs: {
      story: {
        height: '500px',
      },
    },
  },
  render: () => ({
    components: {
      OeEditor,
    },
    setup() {
      const model = ref('');
      const toolbar = ref<OeEditorToolbarConfig>({
        undo: true,
        redo: true,
        bold: true,
        italic: true,
        strike: true,
        underline: true,
        color: true,
        background: true,
        sub: true,
        super: true,
        blockquote: true,
        codeblock: true,
        bullist: true,
        numlist: true,
        fullscreen: true,
        indent: true,
        outdent: true,
        align: true,
        code: true,
        private: true,
        header: true,
        removeformat: true,
        biblio: true,
        formula: true,
        image: true,
        link: true,
        video: true,
      });
      return { model, toolbar };
    },
    template: `
      <oe-editor id="editor-2" v-model="model" :toolbar="toolbar" />
    `,
  }),
};

export const DisabledState: Story = {
  render: () => ({
    components: {
      OeEditor,
    },
    setup() {
      const model = ref('');
      return { model };
    },
    template: `
      <oe-editor mod-disabled id="editor-3" v-model="model" />
    `,
  }),
};
