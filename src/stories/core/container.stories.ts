import { VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { remove } from 'lodash-es';
import { ref } from 'vue';
import { ITab, OeContainer } from '@components/core';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeContainer> = {
  title: 'Core/Container',
  component: OeContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `The container is a white flexbox element on a page. It will take the height of its content and will become scrollable when overflowing.
          \n\r**Features:**
          \n\r- Responsive white container with flexible height
          \n\r- Automatic scrolling when content overflows
          \n\r- Optional tab system at the bottom
          \n\r- Support for closable and non-closable tabs
          \n\r- Edit mode indication for tabs
          \n\r**Usage:**
          \n\r\`\`\`vue
          <OeContainer>
  <!-- Your content here -->
</OeContainer>
          \`\`\`
        `,
      },
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
    backgrounds: {
      default: 'gray',
      values: [{ name: 'gray', value: '#f3f3f3' }],
    },
  },
  argTypes: {
    default: {
      description: 'Default slot rendering the container content',
      control: false,
    },
    tabs: {
      description: 'Tabs to show at the bottom of the container',
      control: 'object',
      table: {
        type: { summary: 'ITab[]' },
        defaultValue: { summary: '[]' },
      },
    },
    activeTab: {
      description: 'Active tab - needed to have the visual indication of which tab is selected',
      control: false,
      table: {
        type: { summary: 'ITab' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onTabSelected: {
      description: 'Emitted when a tab is selected',
      action: 'tab-selected',
      table: {
        type: { summary: '(tab: ITab) => void' },
      },
    },
    onTabClosed: {
      description: 'Emitted when a tab is closed',
      action: 'tab-closed',
      table: {
        type: { summary: '(tab: ITab) => void' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeContainer>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic container with default content. The container automatically adjusts to fit its content.',
      },
    },
  },
  render: () => ({
    components: { OeContainer },
    template: `
      <OeContainer>
        <h2 class="vl-title vl-title--h2">Basic Container</h2>
        <p class="vl-u-spacer-bottom--small">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Orci phasellus egestas tellus rutrum tellus pellentesque. Euismod quis viverra nibh cras pulvinar.
        </p>
        <p>
          Viverra nibh cras pulvinar mattis nunc sed. Adipiscing elit pellentesque habitant morbi tristique senectus et netus.
          Nulla facilisi etiam dignissim diam quis enim. Ipsum consequat nisl vel pretium lectus.
        </p>
      </OeContainer>
    `,
  }),
};

export const Overflow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When the content exceeds the container height, a scrollbar appears automatically. This example has a fixed height of 200px.',
      },
    },
  },
  render: () => ({
    components: { OeContainer },
    template: `
      <OeContainer style="height: 200px">
        <h2 class="vl-title vl-title--h2">Scrollable Container</h2>
        <p class="vl-u-spacer-bottom--small">
          This container has limited height and will show a scrollbar when content overflows.
        </p>
        <p class="vl-u-spacer-bottom--small">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Orci phasellus egestas tellus rutrum tellus pellentesque. Euismod quis viverra nibh cras pulvinar. Id leo in vitae turpis.
          Pretium lectus quam id leo. Dis parturient montes nascetur ridiculus mus.
        </p>
        <p class="vl-u-spacer-bottom--small">
          Enim facilisis gravida neque convallis a cras. Eget gravida cum sociis natoque penatibus et magnis.
          Nec nam aliquam sem et tortor consequat id porta. Non diam phasellus vestibulum lorem sed risus ultricies.
        </p>
        <p>
          Viverra nibh cras pulvinar mattis nunc sed. Adipiscing elit pellentesque habitant morbi tristique senectus et netus.
          Nulla facilisi etiam dignissim diam quis enim. Ipsum consequat nisl vel pretium lectus.
          Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque.
        </p>
      </OeContainer>
    `,
  }),
};

export const WithTabs: Story = {
  parameters: {
    docs: {
      story: {
        height: '550px',
      },
      description: {
        story: `Tabs can be passed into this component using the ITab interface.
          \n\r**Tab Management:**
          \n\r- The component handles tab placement and emits events for selecting and closing tabs
          \n\r- The consuming application is responsible for showing/hiding content based on the active tab
          \n\r- Track the selected tab by listening to the \`tab-selected\` event
          \n\r- Tabs can be closable or permanent (like the Menu tab in this example)
          \n\r- Edit mode can be enabled per tab to show visual indication of unsaved changes
        `,
      },
    },
  },
  render: (args) => ({
    components: { OeContainer, VlButton },
    setup: () => {
      const tabs = ref<ITab[]>([{ label: 'Menu', id: 'menu', closable: false, editMode: false }]);
      const activeTab = ref<ITab>(tabs.value[0]);
      const tabCounter = ref(1);
      const actionLog = ref<string[]>([]);

      const addTab = () => {
        const newTab: ITab = {
          label: `Tab ${tabCounter.value}`,
          id: `tab-${tabCounter.value}`,
          closable: true,
          editMode: false,
        };
        tabs.value.push(newTab);
        activeTab.value = newTab;
        tabCounter.value++;
        actionLog.value.unshift(`✅ Created new tab: "${newTab.label}"`);
      };

      const setActiveTab = (tab: ITab) => {
        activeTab.value = tab;
        actionLog.value.unshift(`👆 Selected tab: "${tab.label}"`);
      };

      const closeTab = (tab: ITab) => {
        remove(tabs.value, (item) => item.id === tab.id);
        activeTab.value = tabs.value[tabs.value.length - 1];
        actionLog.value.unshift(`❌ Closed tab: "${tab.label}"`);
      };

      const toggleEditMode = () => {
        if (tabs.value.length > 1) {
          tabs.value[1].editMode = !tabs.value[1].editMode;
          const status = tabs.value[1].editMode ? 'enabled' : 'disabled';
          actionLog.value.unshift(`✏️ Edit mode ${status} for "${tabs.value[1].label}"`);
        }
      };

      const clearLog = () => {
        actionLog.value = [];
      };

      return {
        tabs,
        activeTab,
        addTab,
        setActiveTab,
        closeTab,
        toggleEditMode,
        actionLog,
        clearLog,
        args,
      };
    },
    template: `
      <OeContainer
        :tabs="tabs"
        :active-tab="activeTab"
        @tab-selected="setActiveTab"
        @tab-closed="closeTab"
      >
        <div v-if="activeTab.id === 'menu'" style="padding: 20px;">
          <h2 class="vl-title vl-title--h2">Menu Overview</h2>
          <p class="vl-u-spacer-bottom--medium">
            This is the main menu tab. It cannot be closed and serves as the home view.
          </p>

          <div style="margin-bottom: 20px;">
            <VlButton @click="addTab">
              Open New Tab
            </VlButton>
          </div>

          <div v-if="actionLog.length > 0" style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h3 class="vl-title vl-title--h3" style="margin: 0;">Action Log</h3>
              <VlButton @click="clearLog" mod-secondary mod-narrow>
                Clear Log
              </VlButton>
            </div>
            <div style="max-height: 200px; overflow-y: auto; border: 1px solid #cbd2da; border-radius: 4px; padding: 12px; background: #f7f9fc;">
              <div
                v-for="(log, index) in actionLog"
                :key="index"
                style="padding: 8px; margin-bottom: 6px; background: white; border-radius: 4px; font-size: 14px; border-left: 3px solid #0055cc;"
              >
                {{ log }}
              </div>
            </div>
          </div>

          <div style="margin-top: 20px; padding: 15px; background: #f0f5ff; border-radius: 4px;">
            <h4 style="margin-top: 0;">Instructions</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Click "Open New Tab" to create additional tabs</li>
              <li>Switch between tabs by clicking on them</li>
              <li>Close tabs using the ✕ button (Menu tab cannot be closed)</li>
              <li>Try the edit mode feature on other tabs</li>
            </ul>
          </div>
        </div>

        <div v-else style="padding: 20px;">
          <h2 class="vl-title vl-title--h2">{{ activeTab.label }}</h2>

          <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
            <VlButton @click="addTab">
              Open New Tab
            </VlButton>
            <VlButton @click="toggleEditMode" mod-secondary v-if="tabs.length > 1">
              {{ tabs[1].editMode ? 'Disable' : 'Enable' }} Edit Mode (Tab 1)
            </VlButton>
          </div>

          <div style="margin-bottom: 20px; padding: 12px; background: #e8f4fd; border-radius: 4px; border-left: 4px solid #0055cc;">
            <strong>Current Tab Info:</strong>
            <div style="margin-top: 8px; font-family: monospace; font-size: 13px;">
              <div><strong>ID:</strong> {{ activeTab.id }}</div>
              <div><strong>Label:</strong> {{ activeTab.label }}</div>
              <div><strong>Closable:</strong> {{ activeTab.closable ? 'Yes' : 'No' }}</div>
              <div><strong>Edit Mode:</strong> {{ activeTab.editMode ? 'Enabled' : 'Disabled' }}</div>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 class="vl-title vl-title--h3">All Tabs</h3>
            <pre style="background: #f7f9fc; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px;">{{ JSON.stringify(tabs, null, 2) }}</pre>
          </div>

          <p class="vl-u-spacer-bottom--small">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            This content changes based on the active tab.
          </p>
          <p>
            Each tab can have its own unique content and state. The tab system is fully controlled by the parent component,
            allowing for flexible content management.
          </p>
        </div>
      </OeContainer>
    `,
  }),
};
