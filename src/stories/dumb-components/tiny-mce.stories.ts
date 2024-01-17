import '@/scss/main.scss';
import OeTinyMce from '../../components/dumb/OeTinyMCE.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeTinyMce> = {
  title: 'Dumb components/TinyMce',
  component: OeTinyMce,
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
type Story = StoryObj<typeof OeTinyMce>;

export const Default: Story = {
  render: () => ({
    components: {
      OeTinyMce,
    },
    setup() {
      const data = ref(`
        <h1>This is a header</h1>
        <p>This is a paragraph</p>
      `);
      return { data };
    },
    template: `
    <oe-tiny-mce v-model="data" />
    <h3>Output:</h3>
    <pre>{{ data }}</pre>
    `,
  }),
};
