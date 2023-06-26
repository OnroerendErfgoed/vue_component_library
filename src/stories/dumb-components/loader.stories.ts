import { VlButton } from '@govflanders/vl-ui-design-system-vue3';
import OeLoader from '../../components/dumb/OeLoader.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import '@/scss/main.scss';
import { ref } from 'vue';

const meta: Meta<typeof OeLoader> = {
  title: 'Dumb components/Loader',
  component: OeLoader,
  parameters: {
    docs: {
      description: {
        component:
          'The default loader will show for 2 seconds in this story and then disappears to not block the story.\n\n' +
          'Make sure to add font-awesome to your project and to add the custom icon component (https://fontawesome.com/docs/web/use-with/vue/)',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OeLoader>;
export const Default: Story = {
  render: () => ({
    components: {
      OeLoader,
      VlButton,
    },
    setup() {
      const loading = ref(true);
      setTimeout(() => {
        loading.value = false;
      }, 2000);
      return { loading };
    },
    template: `<oe-loader v-if="loading"/>`,
  }),
};

export const FullPageLoader: Story = {
  render: () => ({
    components: {
      OeLoader,
      VlButton,
    },
    setup() {
      const loading = ref(false);
      const showLoader = () => {
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
        }, 5000);
      };
      return { loading, showLoader };
    },
    template: `
      <vl-button @click="showLoader">Show loader for 5 seconds</vl-button>
      <oe-loader v-if="loading"/>
    `,
  }),
};
