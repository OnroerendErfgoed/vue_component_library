import '@/scss/main.scss';
import OeLoader from '../../components/dumb/OeLoader.vue';
import { VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeLoader> = {
  title: 'Dumb components/Loader',
  component: OeLoader,
  parameters: {
    docs: {
      description: {
        component:
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
    template: `<oe-loader title="Gegevens opvragen" sub-title="een moment geduld alstublieft"/>`,
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

export const InlineLoader: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Size modifiers only work for inline loaders.',
      },
    },
  },
  render: () => ({
    components: {
      OeLoader,
    },
    template: `
      Small <oe-loader mod-inline mod-small/>
      Default <oe-loader mod-inline/>
      Large <oe-loader mod-inline mod-large/>
      X Large <oe-loader mod-inline mod-x-large/>
    `,
  }),
};
