import type { Meta, StoryObj } from '@storybook/vue3';
import OeTabContainer from '../../components/dumb/OeTabContainer.vue';
import type { ITabView } from '../../models/tab-container';
import type { Component } from 'vue';

import '@/scss/main.scss';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeTabContainer> = {
  title: 'Dumb components/TabContainer',
  component: OeTabContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    tabs: {
      description: 'Tabs to show in the container.',
      table: {
        type: { summary: 'ITabView[]' },
        defaultValue: { summary: '[]' },
      },
    },
    default: {
      description: 'Slot rendering the tab content.',
      table: {
        type: {
          summary: 'Exposed prop',
          detail: 'activeTab: current tab object',
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeTabContainer>;

// export const Default: Story = {};
export const Default: Story = {
  render: () => ({
    components: {
      OeTabContainer,
    },
    setup() {
      const tabs: ITabView[] = [
        {
          id: 'algemeen',
          label: 'Algemeen',
          component: {} as Component,
        },
        {
          id: 'zone',
          label: 'Zone',
          component: {} as Component,
        },
      ];

      return { tabs };
    },
    template: `
    <oe-tab-container :tabs="tabs">
      <template #default="{ activeTab }">
        <h2>Tab {{ activeTab.label }}</h2>
      </template>
    </oe-tab-container>
    `,
  }),
};
