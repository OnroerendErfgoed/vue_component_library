import '@/scss/main.scss';
import { OeActorWidget } from '@components/smart';
import { ActorType } from '@models/actor';
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
  argTypes: {
    id: {
      description: 'Modal ID property',
      table: {
        type: { summary: 'string' },
      },
    },
    api: {
      description: 'API base URL',
      table: {
        type: { summary: 'string' },
      },
    },
    getSsoToken: {
      description: 'Method that gets authentication token',
      table: {
        type: { summary: 'getSsoToken' },
      },
    },
    dropdown: {
      description: 'Slot to add a role dropdown to assign to selection',
      table: {
        type: { summary: '<template #dropdown></template>' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeActorWidget>;

export const Default: Story = {
  render: () => ({
    components: {
      OeActorWidget,
    },
    setup() {
      const actorType = ActorType.PERSOON;
      const id = '1';
      const api = 'https://dev-actoren.onroerenderfgoed.be';
      return { id, api, actorType };
    },
    template: `
    <div style="zoom: .95">
      <oe-actor-widget search-actor="van hum" :id="id" :api="api" :open="true" @add="console.log" @close="console.log" :actor-type="actorType">
        <template v-slot:dropdown>
          <div class="dropdown"></div>
        </template>
      </oe-actor-widget>
    </div>
    `,
  }),
};

export const WithSsoTokenCallback: Story = {
  render: () => ({
    components: {
      OeActorWidget,
    },
    setup() {
      const actorType = ActorType.PERSOON;
      const id = '1';
      const api = 'http://local.onroerenderfgoed.be:6543';
      const getSsoToken = async () => 1;
      return { id, api, getSsoToken, actorType };
    },
    template: `
    <div style="zoom: .95">
      <oe-actor-widget search-actor="sois" :id="id" :api="api" :get-sso-token="getSsoToken" :open="true" @add="console.log" @close="console.log" :actor-type="actorType">
        <template v-slot:dropdown>
          <div class="dropdown"></div>
        </template>
      </oe-actor-widget>
    </div>
    `,
  }),
};
