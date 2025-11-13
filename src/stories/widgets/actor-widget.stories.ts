import {
  CellStyleModule,
  ColumnAutoSizeModule,
  InfiniteRowModelModule,
  ModuleRegistry,
  RowSelectionModule,
  ValidationModule,
} from 'ag-grid-community';
import { ref } from 'vue';
import OeActorWidget from '@components/widgets/smart/OeActorWidget.vue';
import { ActorType } from '@models/actor';
import type { Meta, StoryObj } from '@storybook/vue3';

ModuleRegistry.registerModules([
  InfiniteRowModelModule,
  ValidationModule,
  ColumnAutoSizeModule,
  RowSelectionModule,
  CellStyleModule,
]);

const meta: Meta<typeof OeActorWidget> = {
  title: 'Widgets Module/Actor Widget',
  component: OeActorWidget,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Modal to find and select an actor.`,
      },
      story: {
        inline: false,
        iframeHeight: 800,
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
    disableAddButton: {
      description: 'Disable add button until extended conditions are met',
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
      const open = ref(true);
      return { id, api, actorType, open };
    },
    template: `
    <div style="zoom: .95">
      <oe-actor-widget  :id="id" :api="api" :open="open" @add="console.log" @close="open=false" :actor-type="actorType">
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
      const api = 'https://dev-actoren.onroerenderfgoed.be';
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
