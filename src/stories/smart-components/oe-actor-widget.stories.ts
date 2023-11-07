import '@/scss/main.scss';
import { OeActorWidget } from '@/components';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeActorWidget> = {
  title: 'Smart components/OeActorWidget',
  component: OeActorWidget,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Modal to find and select an actor.`,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OeActorWidget>;

export const Default: Story = {
  render: () => ({
    components: {
      OeActorWidget,
    },
    setup() {
      const id = '1';
      const api = 'https://dev-actoren.onroerenderfgoed.be';
      const getSsoToken = async () => 1;
      return { id, api, getSsoToken };
    },
    template: `
    <div style="zoom: .95">
      <oe-actor-widget :id="id" :api="api" :get-sso-token="getSsoToken" :open="true" @add="console.log" @close="console.log">
        <template v-slot:dropdown>
          <div class="dropdown"></div>
        </template>
      </oe-actor-widget>
    </div>
    `,
  }),
};
