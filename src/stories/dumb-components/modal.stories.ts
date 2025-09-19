import { VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import OeModal from '@/components/dumb/OeModal.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeModal> = {
  title: 'Dumb components/Modal',
  component: OeModal,
  tags: ['autodocs'],
  args: {
    modEnableScroll: true, // Enable background scroll to prevent storybook scroll lock
  },
  parameters: {
    docs: {
      description: {
        component: 'A modal wrapper component around VlModal with enhanced functionality.',
      },
    },
  },
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    closable: { control: 'boolean' },
    modLarge: { control: 'boolean' },
    modMedium: { control: 'boolean' },
    modLocked: { control: 'boolean' },
    modEnableScroll: { control: 'boolean' },
    modRight: { control: 'boolean' },
    modLeft: { control: 'boolean' },
    modTop: { control: 'boolean' },
    modBottom: { control: 'boolean' },
    modDisableBackdrop: { control: 'boolean' },
    modFocusOnClose: { control: 'boolean' },
    role: { control: 'select', options: ['dialog', 'alert', 'alertdialog'] },
    titleTagName: { control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
  },
};

export default meta;
type Story = StoryObj<typeof OeModal>;

export const Default: Story = {
  render: (args) => ({
    components: { OeModal, VlButton },
    setup() {
      const isOpen = ref(false);
      const openModal = () => {
        isOpen.value = true;
      };
      const closeModal = (e) => {
        console.log('Event details:', e);
        isOpen.value = false;
      };

      return { isOpen, openModal, closeModal, args };
    },
    template: `
      <div style="min-height: 400px;"> <!-- Set a minimal height -->
        <VlButton @click="openModal">Open Modal</VlButton>
        <OeModal
          v-bind="args"
          v-model:open="isOpen"
          @update:open="closeModal"
        >
          <p>This is the default modal content. You can put any content here.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </OeModal>
      </div>
    `,
  }),
  args: {
    id: 'default-modal',
    title: 'Default Modal',
    closable: true,
  },
};

export const Large: Story = {
  render: (args) => ({
    components: { OeModal, VlButton },
    setup() {
      const isOpen = ref(false);
      const openModal = () => {
        isOpen.value = true;
      };
      const closeModal = () => {
        isOpen.value = false;
      };

      return { isOpen, openModal, closeModal, args };
    },
    template: `
      <div style="min-height: 400px;"> <!-- Set a minimal height -->
        <VlButton @click="openModal">Open Large Modal</VlButton>
        <OeModal
          v-bind="args"
          v-model:open="isOpen"
          @update:open="closeModal"
        >
          <p>This is a large modal with more space for content.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        </OeModal>
      </div>
    `,
  }),
  args: {
    id: 'large-modal',
    title: 'Large Modal',
    modLarge: true,
    closable: true,
  },
};

export const Medium: Story = {
  render: (args) => ({
    components: { OeModal, VlButton },
    setup() {
      const isOpen = ref(false);
      const openModal = () => {
        isOpen.value = true;
      };
      const closeModal = () => {
        isOpen.value = false;
      };

      return { isOpen, openModal, closeModal, args };
    },
    template: `
      <div style="min-height: 400px;"> <!-- Set a minimal height -->
        <VlButton @click="openModal">Open Medium Modal</VlButton>
        <OeModal
          v-bind="args"
          v-model:open="isOpen"
          @update:open="closeModal"
        >
          <p>This is a medium-sized modal.</p>
          <p>Perfect for forms or moderate amounts of content.</p>
        </OeModal>
      </div>
    `,
  }),
  args: {
    id: 'medium-modal',
    title: 'Medium Modal',
    modMedium: true,
    closable: true,
  },
};

export const RightAligned: Story = {
  render: (args) => ({
    components: { OeModal, VlButton },
    setup() {
      const isOpen = ref(false);
      const openModal = () => {
        isOpen.value = true;
      };
      const closeModal = () => {
        isOpen.value = false;
      };

      return { isOpen, openModal, closeModal, args };
    },
    template: `
      <div style="min-height: 400px;"> <!-- Set a minimal height -->
        <VlButton @click="openModal">Open Right-aligned Modal</VlButton>
        <OeModal
          v-bind="args"
          v-model:open="isOpen"
          @update:open="closeModal"
        >
          <p>This modal appears on the right side of the screen.</p>
          <p>Useful for sidebars or navigation panels.</p>
        </OeModal>
      </div>
    `,
  }),
  args: {
    id: 'right-modal',
    title: 'Right-aligned Modal',
    modRight: true,
    closable: true,
  },
};

export const NotClosable: Story = {
  render: (args) => ({
    components: { OeModal, VlButton },
    setup() {
      const isOpen = ref(false);
      const openModal = () => {
        isOpen.value = true;
      };
      const closeModal = () => {
        isOpen.value = false;
      };

      return { isOpen, openModal, closeModal, args };
    },
    template: `
      <div style="min-height: 400px;"> <!-- Set a minimal height -->
        <VlButton @click="openModal">Open Non-closable Modal</VlButton>
        <OeModal
          v-bind="args"
          v-model:open="isOpen"
          @update:open="closeModal"
        >
          <p>This modal cannot be closed with the X button.</p>
          <p>You must use the button below to close it.</p>
          <VlButton @click="closeModal">Close Modal</VlButton>
        </OeModal>
      </div>
    `,
  }),
  args: {
    id: 'not-closable-modal',
    title: 'Non-closable Modal',
    closable: false,
  },
};

export const WithScrollableContent: Story = {
  render: (args) => ({
    components: { OeModal, VlButton },
    setup() {
      const isOpen = ref(false);
      const openModal = () => {
        isOpen.value = true;
      };
      const closeModal = () => {
        isOpen.value = false;
      };

      return { isOpen, openModal, closeModal, args };
    },
    template: `
      <div style="min-height: 400px;"> <!-- Set a minimal height -->
        <VlButton @click="openModal">Open Modal with Scrollable Content</VlButton>
        <OeModal
          v-bind="args"
          v-model:open="isOpen"
          @update:open="closeModal"
        >
          <p>This modal has a lot of content that requires scrolling.</p>
          <p v-for="i in 20" :key="i">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Paragraph {{ i }}.</p>
        </OeModal>
      </div>
    `,
  }),
  args: {
    id: 'scrollable-modal',
    title: 'Modal with Scrollable Content',
    closable: true,
    modEnableScroll: true,
  },
};

export const AlertDialog: Story = {
  render: (args) => ({
    components: { OeModal, VlButton },
    setup() {
      const isOpen = ref(false);
      const openModal = () => {
        isOpen.value = true;
      };
      const closeModal = () => {
        isOpen.value = false;
      };

      return { isOpen, openModal, closeModal, args };
    },
    template: `
      <div style="min-height: 400px;"> <!-- Set a minimal height -->
        <VlButton @click="openModal">Open Alert Dialog</VlButton>
        <OeModal
          v-bind="args"
          v-model:open="isOpen"
          @update:open="closeModal"
        >
          <p><strong>Warning:</strong> This action cannot be undone.</p>
          <p>Are you sure you want to continue?</p>
          <div style="margin-top: 1rem;">
            <VlButton @click="closeModal" style="margin-right: 0.5rem;">Cancel</VlButton>
            <VlButton @click="closeModal" variant="danger">Delete</VlButton>
          </div>
        </OeModal>
      </div>
    `,
  }),
  args: {
    id: 'alert-dialog',
    title: 'Confirm Delete',
    role: 'alertdialog',
    closable: true,
  },
};
