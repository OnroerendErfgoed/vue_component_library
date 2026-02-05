import { VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import OeContextMenu from '@components/core/dumb/OeContextMenu.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeContextMenu> = {
  title: 'Core Module/Context Menu',
  component: OeContextMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        type: 'code',
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of menu items to display',
    },
    action: {
      description: 'Emitted when a menu action is clicked',
    },
  },
} satisfies Meta<typeof OeContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic context menu with simple menu items
 */
export const Basic: Story = {
  args: {
    items: [
      { label: 'Edit', action: 'edit' },
      { label: 'Delete', action: 'delete' },
      { label: 'View Details', action: 'view-details' },
    ],
  },
  render: (args) => ({
    components: { OeContextMenu, VlButton },
    setup() {
      const handleAction = (action: string) => {
        console.log('Action triggered:', action);
      };
      return { args, handleAction };
    },
    template: `
      <div style="padding: 40px; background: #f5f5f5; min-height: 300px;">
        <p>Click the button below to open the context menu:</p>
        <VlButton @click="(e) => $refs.menu?.toggleMenu?.(e)"">
          Open Menu
        </VlButton>
        <OeContextMenu ref="menu" :items="args.items" @action="handleAction" />
      </div>
    `,
  }),
};

/**
 * Context menu with dividers to group related items
 */
export const WithDividers: Story = {
  args: {
    items: [
      { label: 'New', action: 'new' },
      { label: 'Open', action: 'open' },
      { type: 'divider' },
      { label: 'Save', action: 'save' },
      { label: 'Save As', action: 'save-as' },
      { type: 'divider' },
      { label: 'Exit', action: 'exit' },
    ],
  },
  render: (args) => ({
    components: { OeContextMenu, VlButton },
    setup() {
      const handleAction = (action: string) => {
        console.log('Action triggered:', action);
      };
      return { args, handleAction };
    },
    template: `
      <div style="padding: 40px; background: #f5f5f5; min-height: 300px;">
        <p>Context menu with grouped items using dividers:</p>
        <VlButton @click="(e) => $refs.menu?.toggleMenu?.(e)">
          Open Menu
        </VlButton>
        <OeContextMenu ref="menu" :items="args.items" @action="handleAction" />
      </div>
    `,
  }),
};

/**
 * Context menu with submenus for nested actions
 */
export const WithSubmenus: Story = {
  args: {
    items: [
      { label: 'Edit', action: 'edit' },
      {
        label: 'Format',
        submenu: [
          { label: 'Bold', action: 'format-bold' },
          { label: 'Italic', action: 'format-italic' },
          { label: 'Underline', action: 'format-underline' },
        ],
      },
      { type: 'divider' },
      {
        label: 'Export',
        submenu: [
          { label: 'PDF', action: 'export-pdf' },
          { label: 'Excel', action: 'export-excel' },
          { label: 'CSV', action: 'export-csv' },
        ],
      },
      { label: 'Delete', action: 'delete' },
    ],
  },
  render: (args) => ({
    components: { OeContextMenu, VlButton },
    setup() {
      const handleAction = (action: string) => {
        console.log('Action triggered:', action);
      };
      return { args, handleAction };
    },
    template: `
      <div style="padding: 40px; background: #f5f5f5; min-height: 400px;">
        <p>Context menu with submenus. Hover over items with submenus to reveal nested options:</p>
        <VlButton @click="(e) => $refs.menu?.toggleMenu?.(e)">
          Open Menu
        </VlButton>
        <OeContextMenu ref="menu" :items="args.items" @action="handleAction" />
      </div>
    `,
  }),
};

/**
 * Complex context menu with mixed content
 */
export const Complex: Story = {
  args: {
    items: [
      { label: 'Cut', action: 'cut' },
      { label: 'Copy', action: 'copy' },
      { label: 'Paste', action: 'paste' },
      { type: 'divider' },
      {
        label: 'Share',
        submenu: [
          { label: 'Share via Email', action: 'share-email' },
          { label: 'Share via Link', action: 'share-link' },
          { type: 'divider' },
          { label: 'Manage Access', action: 'manage-access' },
        ],
      },
      { type: 'divider' },
      {
        label: 'Move to',
        submenu: [
          { label: 'Archive', action: 'move-archive' },
          { label: 'Trash', action: 'move-trash' },
        ],
      },
      { type: 'divider' },
      { label: 'Properties', action: 'properties' },
    ],
  },
  render: (args) => ({
    components: { OeContextMenu, VlButton },
    setup() {
      const handleAction = (action: string) => {
        console.log('Action triggered:', action);
      };
      return { args, handleAction };
    },
    template: `
      <div style="padding: 40px; background: #f5f5f5; min-height: 500px;">
        <p>Complex context menu with multiple levels and dividers:</p>
        <VlButton @click="(e) => $refs.menu?.toggleMenu?.(e)">
          Open Menu
        </VlButton>
        <OeContextMenu ref="menu" :items="args.items" @action="handleAction" />
      </div>
    `,
  }),
};

/**
 * Empty context menu
 */
export const Empty: Story = {
  args: {
    items: [],
  },
  render: (args) => ({
    components: { OeContextMenu, VlButton },
    setup() {
      const handleAction = (action: string) => {
        console.log('Action triggered:', action);
      };
      return { args, handleAction };
    },
    template: `
      <div style="padding: 40px; background: #f5f5f5; min-height: 300px;">
        <p>Empty context menu (no items):</p>
        <VlButton @click="(e) => $refs.menu?.toggleMenu?.(e)">
          Open Menu
        </VlButton>
        <OeContextMenu ref="menu" :items="args.items" @action="handleAction" />
      </div>
    `,
  }),
};

/**
 * Context menu with long labels
 */
export const LongLabels: Story = {
  args: {
    items: [
      { label: 'Edit with Extended Options', action: 'edit' },
      { label: 'Create a Duplicate of This Item', action: 'duplicate' },
      { type: 'divider' },
      {
        label: 'Advanced Operations',
        submenu: [
          { label: 'Convert to Different Format', action: 'convert' },
          { label: 'Merge with Another Item', action: 'merge' },
        ],
      },
      { label: 'Delete Permanently and Remove from Backups', action: 'delete' },
    ],
  },
  render: (args) => ({
    components: { OeContextMenu, VlButton },
    setup() {
      const handleAction = (action: string) => {
        console.log('Action triggered:', action);
      };
      return { args, handleAction };
    },
    template: `
      <div style="padding: 40px; background: #f5f5f5; min-height: 400px;">
        <p>Context menu with long labels (demonstrates max-width handling):</p>
        <VlButton @click="(e) => $refs.menu?.toggleMenu?.(e)">
          Open Menu
        </VlButton>
        <OeContextMenu ref="menu" :items="args.items" @action="handleAction" />
      </div>
    `,
  }),
};

/**
 * Interactive example showing action logging
 */
export const Interactive: Story = {
  args: {
    items: [
      { label: 'Create New', action: 'create' },
      { label: 'Edit', action: 'edit' },
      { label: 'View', action: 'view' },
      { type: 'divider' },
      {
        label: 'More Options',
        submenu: [
          { label: 'Archive', action: 'archive' },
          { label: 'Clone', action: 'clone' },
          { label: 'Download', action: 'download' },
        ],
      },
      { type: 'divider' },
      { label: 'Delete', action: 'delete' },
    ],
  },
  render: (args) => ({
    components: { OeContextMenu, VlButton },
    setup() {
      const actions = ref<string[]>([]);

      const handleAction = (action: string) => {
        actions.value.unshift(`${new Date().toLocaleTimeString()}: ${action}`);
        if (actions.value.length > 10) {
          actions.value.pop();
        }
      };

      return { args, handleAction, actions };
    },
    template: `
      <div style="padding: 40px; background: #f5f5f5; min-height: 500px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <p>Click "Open Menu" and select actions. They will be logged on the right:</p>
          <VlButton @click="(e) => $refs.menu?.toggleMenu?.(e)">
            Open Menu
          </VlButton>
          <OeContextMenu ref="menu" :items="args.items" @action="handleAction" />
        </div>
        <div style="background: white; padding: 16px; border-radius: 4px; border: 1px solid #ccc; max-height: 400px; overflow-y: auto;">
          <h4 style="margin-top: 0; margin-bottom: 8px;">Action Log</h4>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li v-for="(action, index) in actions" :key="index" style="padding: 4px 0; font-size: 12px; font-family: monospace; border-bottom: 1px solid #f0f0f0;">
              {{ action }}
            </li>
          </ul>
          <p v-if="actions.length === 0" style="color: #999; font-size: 12px; margin: 0;">No actions yet...</p>
        </div>
      </div>
    `,
  }),
};

/**
 * Context menu triggered by right-click
 */
export const RightClick: Story = {
  args: {
    items: [
      { label: 'Edit', action: 'edit' },
      { label: 'Duplicate', action: 'duplicate' },
      { type: 'divider' },
      { label: 'Delete', action: 'delete' },
    ],
  },
  render: (args) => ({
    components: { OeContextMenu },
    setup() {
      const handleAction = (action: string) => {
        console.log('Action triggered:', action);
      };

      return { args, handleAction };
    },
    template: `
      <div
        @contextmenu.prevent="(e) => $refs.menu?.toggleMenu?.(e)"
        style="padding: 40px; background: #f5f5f5; min-height: 400px; border: 2px dashed #ccc; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: context-menu;"
      >
        <p style="margin: 0; color: #666; font-size: 16px;">Right-click here to open the context menu</p>
        <OeContextMenu ref="menu" :items="args.items" @action="handleAction" />
      </div>
    `,
  }),
};
