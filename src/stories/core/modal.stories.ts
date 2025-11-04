import { VlActionGroup, VlButton, VlModalToggle, VlTitle } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import { OeModal } from '@components/core';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeModal> = {
  title: 'Core Module/Modal',
  component: OeModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen', // Change from centered to fullscreen for modals
    docs: {
      story: {
        inline: false,
        iframeHeight: 350,
      },
      description: {
        component: `A modal wrapper component around VlModal with enhanced functionality.
          \n\rAll props of VlModal are supported. (https://master--642e92e0cda6c627a0601f07.chromatic.com/?path=/docs/components-vl-modal--docs#parameters)
          \n\rThe goal is to handle all open and close logic in a centralized way and to provide a consistent API for modals across the application.
          \n\r**Usage notes:**
          \n\r- Use the \`v-model:open\` directive to control the modal's visibility.
          \n\r- The modal content is provided via the default slot. More named slots are available for header, content, and footer customization.
          \n\r- The modal is focus-locked by default to enhance accessibility, preventing focus from leaving the modal when it's open.
          \n\r- The modal can be made closable via X by setting the \`closable\` prop to true, which adds a close button to the upper right corner of the modal. By default, the modal can be closed by clicking outside or pressing the escape key when focused.
          Both behaviors work in conjunction with the \`v-model:open\` directive.
       `,
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls modal visibility',
    },
    title: {
      control: 'text',
      description: 'Modal title',
    },
    closable: {
      control: 'boolean',
      description: 'Show close button',
    },
  },
  // Remove tags: ['autodocs'] - moved to parameters
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Modal Title',
  },
  render: (args) => ({
    components: { OeModal, VlButton },
    setup() {
      const isOpen = ref(true);
      const openModal = () => {
        isOpen.value = true;
      };
      const closeModal = () => {
        isOpen.value = false;
      };

      return { isOpen, openModal, closeModal, args };
    },
    template: `
        <div>
          <VlButton @click="openModal">Open Modal</VlButton>
          <OeModal v-model:open="isOpen" v-bind="args">
            <p>This is the default modal content. You can put any content here.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </OeModal>
        </div>
    `,
  }),
};

export const Closable: Story = {
  args: {
    title: 'Closable Modal Title',
    closable: true,
  },
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
        <div>
          <VlButton @click="openModal">Open Closable Modal</VlButton>
          <OeModal v-model:open="isOpen" v-bind="args">
            <p>This modal can be closed by clicking the close button, clicking outside the modal, or pressing the ESC key when focusing on the modal.</p>
          </OeModal>
        </div>
    `,
  }),
};

export const CustomSlotContent: Story = {
  args: {
    // No title - using custom header slot
  },
  render: (args) => ({
    components: { OeModal, VlButton, VlTitle, VlActionGroup },
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
        <div>
          <VlButton @click="openModal">Open Modal with Custom Content</VlButton>
          <OeModal v-model:open="isOpen" v-bind="args">
            <template #modal-header>
              <VlTitle tag-name="h2">Custom Modal Title</VlTitle>
            </template>
            <template #modal-content>
              <p>This modal has custom content provided via slots.</p>
              <ul>
                <li>Point one</li>
                <li>Point two</li>
              </ul>
            </template>
            <template #modal-footer>
              <VlActionGroup mod-align-center>
                <VlButton @click="closeModal">Close</VlButton>
              </VlActionGroup>
            </template>
          </OeModal>
        </div>
    `,
  }),
};

export const ToggleDirective: Story = {
  args: {
    title: 'Toggle Modal Title',
    id: 'custom-modal',
  },
  render: (args) => ({
    directives: { VlModalToggle },
    components: { OeModal, VlButton, VlActionGroup },
    setup() {
      const isOpen = ref(false);
      const toggleModal = () => {
        isOpen.value = !isOpen.value;
      };

      return { isOpen, toggleModal, args };
    },
    template: `
        <div>
          <VlButton v-vl-modal-toggle="'custom-modal'">Toggle Modal</VlButton>
          <OeModal v-bind="args">
            <p>This modal is toggled using the modal toggle directive.</p>
            <template #modal-footer>
              <VlActionGroup mod-align-center>
                <VlButton v-vl-modal-toggle="'custom-modal'">Close</VlButton>
              </VlActionGroup>
            </template>
          </OeModal>
        </div>
    `,
  }),
};

export const BackdropCloseDisabled: Story = {
  args: {
    title: 'Non-Closable Backdrop Modal Title',
    'mod-disable-backdrop-close': true,
  },
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
        <div>
          <VlButton @click="openModal">Open Non-Closable Backdrop Modal</VlButton>
          <OeModal v-model:open="isOpen" v-bind="args">
            <p>This modal cannot be closed by clicking on the backdrop.</p>
            <p>You can only close it using the close button or by pressing the ESC key when focusing on the modal.</p>
            <template #modal-footer>
              <VlButton @click="closeModal">Close</VlButton>
            </template>
          </OeModal>
        </div>
    `,
  }),
};
