import '@/scss/main.scss';
import { ref } from 'vue';
import OeEditor from '@components/dumb/OeEditor.vue';
import { OeEditorToolbar } from '@models/editor';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeEditor> = {
  title: 'Dumb components/Editor',
  component: OeEditor,
  parameters: {
    docs: {
      description: {
        component:
          'The default editor with no options enables a basic toolbar with undo, redo, and a few formatting options. It also limits pasting text to formats that can be set in the toolbar and will strip out any unsupported HTML tags and styles.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'The default editor with no options enables a basic toolbar with undo, redo, and a few formatting options. It also limits pasting text to formats that can be set in the toolbar and will strip out any unsupported HTML tags and styles.',
      },
    },
  },
  render: () => ({
    components: {
      OeEditor,
    },
    setup() {
      const model = ref(`
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333;">
          <h1 style="font-size: 24px; font-weight: bold; color: #444;">Welcome to the OE Editor</h1>
          <p style="margin: 16px 0;">
            This is an example of a paragraph with <strong style="font-weight: bold;">bold</strong>,
            <em style="font-style: italic;">italic</em>, and
            <u style="text-decoration: underline;">underlined</u> text.
          </p>
          <blockquote style="margin: 16px 0; padding: 8px 16px; border-left: 4px solid #ccc; color: #666;">
            This is a blockquote example.
          </blockquote>
          <ul style="margin: 16px 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">First item</li>
            <li style="margin-bottom: 8px;">Second item</li>
            <li>Third item</li>
          </ul>
          <p style="margin: 16px 0;">
            Here is a link:
            <a href="https://example.com" style="color: #007BFF; text-decoration: none;">Visit Example</a>
          </p>
          <p style="margin: 16px 0;">
            <span style="background-color: #FFFF00;">Highlighted text</span> and
            <span style="color: #FF0000;">colored text</span>.
          </p>
        </div>
      `);
      return { model };
    },
    template: `<oe-editor id="default-editor" v-model="model" />`,
  }),
};

export const AllowAllFormats: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The editor with all formats enabled. This enables all the formatting options available in the editor. Not all formats are supported in the toolbar, but the editor will allow for all formats to be used on paste.',
      },
    },
  },
  render: () => ({
    components: {
      OeEditor,
    },
    setup() {
      const model = ref(`
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333;">
          <h1 style="font-size: 24px; font-weight: bold; color: #444;">Welcome to the OE Editor</h1>
          <p style="margin: 16px 0;">
            This is an example of a paragraph with <strong style="font-weight: bold;">bold</strong>,
            <em style="font-style: italic;">italic</em>, and
            <u style="text-decoration: underline;">underlined</u> text.
          </p>
          <blockquote style="margin: 16px 0; padding: 8px 16px; border-left: 4px solid #ccc; color: #666;">
            This is a blockquote example.
          </blockquote>
          <ul style="margin: 16px 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">First item</li>
            <li style="margin-bottom: 8px;">Second item</li>
            <li>Third item</li>
          </ul>
          <p style="margin: 16px 0;">
            Here is a link:
            <a href="https://example.com" style="color: #007BFF; text-decoration: none;">Visit Example</a>
          </p>
          <p style="margin: 16px 0;">
            <span style="background-color: #FFFF00;">Highlighted text</span> and
            <span style="color: #FF0000;">colored text</span>.
          </p>
        </div>
      `);
      return { model };
    },
    template: `<oe-editor id="editor-all-formats" v-model="model" enable-all-formats />`,
  }),
};

export const FullToolbar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The editor with a full toolbar. This enables all the formatting options available in the editor plus the full toolbar.',
      },
    },
  },
  render: () => ({
    components: {
      OeEditor,
    },
    setup() {
      const model = ref(`
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333;">
          <h1 style="font-size: 24px; font-weight: bold; color: #444;">Welcome to the OE Editor</h1>
          <p style="margin: 16px 0;">
            This is an example of a paragraph with <strong style="font-weight: bold;">bold</strong>,
            <em style="font-style: italic;">italic</em>, and
            <u style="text-decoration: underline;">underlined</u> text.
          </p>
          <blockquote style="margin: 16px 0; padding: 8px 16px; border-left: 4px solid #ccc; color: #666;">
            This is a blockquote example.
          </blockquote>
          <ul style="margin: 16px 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">First item</li>
            <li style="margin-bottom: 8px;">Second item</li>
            <li>Third item</li>
          </ul>
          <p style="margin: 16px 0;">
            Here is a link:
            <a href="https://example.com" style="color: #007BFF; text-decoration: none;">Visit Example</a>
          </p>
          <p style="margin: 16px 0;">
            <span style="background-color: #FFFF00;">Highlighted text</span> and
            <span style="color: #FF0000;">colored text</span>.
          </p>
        </div>
      `);
      return { model };
    },
    template: `<oe-editor id="editor-full-toolbar" v-model="model" enable-full-toolbar />`,
  }),
};

export const CustomToolbar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The editor with a custom toolbar. This enables specific formatting options available in the editor. The toolbar can be customized to include only the desired options.',
      },
    },
  },
  render: () => ({
    components: {
      OeEditor,
    },
    setup() {
      const model = ref(`
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333;">
          <h1 style="font-size: 24px; font-weight: bold; color: #444;">Welcome to the OE Editor</h1>
          <p style="margin: 16px 0;">
            This is an example of a paragraph with <strong style="font-weight: bold;">bold</strong>,
            <em style="font-style: italic;">italic</em>, and
            <u style="text-decoration: underline;">underlined</u> text.
          </p>
          <blockquote style="margin: 16px 0; padding: 8px 16px; border-left: 4px solid #ccc; color: #666;">
            This is a blockquote example.
          </blockquote>
          <ul style="margin: 16px 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">First item</li>
            <li style="margin-bottom: 8px;">Second item</li>
            <li>Third item</li>
          </ul>
          <p style="margin: 16px 0;">
            Here is a link:
            <a href="https://example.com" style="color: #007BFF; text-decoration: none;">Visit Example</a>
          </p>
          <p style="margin: 16px 0;">
            <span style="background-color: #FFFF00;">Highlighted text</span> and
            <span style="color: #FF0000;">colored text</span>.
          </p>
        </div>
      `);
      const toolbar = ref<OeEditorToolbar[]>([
        OeEditorToolbar.BOLD,
        OeEditorToolbar.ITALIC,
        OeEditorToolbar.UNDERLINE,
        OeEditorToolbar.BULLIST,
        OeEditorToolbar.NUMLIST,
        OeEditorToolbar.COLOR,
        OeEditorToolbar.BACKGROUND,
      ]);
      const formats = ref([
        OeEditorToolbar.BOLD,
        OeEditorToolbar.ITALIC,
        OeEditorToolbar.UNDERLINE,
        OeEditorToolbar.BACKGROUND,
        OeEditorToolbar.COLOR,
      ]);
      return { model, toolbar, formats };
    },
    template: `<oe-editor id="editor-custom-toolbar" v-model="model" :toolbar="toolbar" :formats="formats" />`,
  }),
};

export const DisabledState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The editor in a disabled state. This disables all the formatting options available in the editor and will not allow any changes to be made to the text.',
      },
    },
  },
  render: () => ({
    components: {
      OeEditor,
    },
    setup() {
      const model = ref('This area is disabled!');
      return { model };
    },
    template: `
      <oe-editor mod-disabled id="editor-3" v-model="model" />
    `,
  }),
};
