import '@/scss/main.scss';
import OeTinyMce from '../../components/dumb/OeTinyMCE.vue';
import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeTinyMce> = {
  title: 'Dumb components/TinyMce',
  component: OeTinyMce,
  parameters: {
    docs: {
      description: {
        component: 'Rich text editor wrapper',
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
      const data = ref('<p>xxxx</p>');
      return { data };
    },
    template: `
    <oe-tiny-mce :value="data" @update:value="data = $event" />
    <h3>Output:</h3>
    <pre>{{ data }}</pre>
    `,
  }),
};
