import { ref } from 'vue';
import { OeTinyMCE } from '@components/editor';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeTinyMCE> = {
  title: 'Editor Module/Tiny MCE',
  component: OeTinyMCE,
  parameters: {
    docs: {
      description: {
        component: `Rich text editor wrapper. To remove warning label, make sure tinymce is imported in a script tag in the template file.`,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OeTinyMCE>;

export const Default: Story = {
  render: () => ({
    components: {
      OeTinyMCE,
    },
    setup() {
      const data = ref(`
        <h1>This is a header</h1>
        <p>This is a paragraph</p>
      `);
      return { data };
    },
    template: `
    <OeTinyMCE v-model="data" />
    <h3>Output:</h3>
    <pre>{{ data }}</pre>
    `,
  }),
};
