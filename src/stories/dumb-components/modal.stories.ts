import { VlActionGroup, VlButton, VlModalToggle, VlTitle } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import OeModal from '@/components/dumb/OeModal.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeModal> = {
  title: 'Dumb components/Modal',
  component: OeModal,
  tags: ['autodocs'],
  parameters: {
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
};

export default meta;
type Story = StoryObj<typeof OeModal>;

export const Default: Story = {
  render: () => ({
    components: { OeModal, VlButton },
    setup() {
      const isOpen = ref(true);
      const openModal = () => {
        isOpen.value = true;
      };
      const closeModal = () => {
        isOpen.value = false;
      };

      return { isOpen, openModal, closeModal };
    },
    template: `
        <VlButton @click="openModal">Open Modal</VlButton>
        <OeModal v-model:open="isOpen" title="Default Modal Title">
          <p>This is the default modal content. You can put any content here.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </OeModal>
    `,
  }),
};

export const Closable: Story = {
  render: () => ({
    components: { OeModal, VlButton },
    setup() {
      const isOpen = ref(false);
      const openModal = () => {
        isOpen.value = true;
      };
      const closeModal = () => {
        isOpen.value = false;
      };

      return { isOpen, openModal, closeModal };
    },
    template: `
        <VlButton @click="openModal">Open Closable Modal</VlButton>
        <OeModal v-model:open="isOpen" title="Closable Modal Title" closable>
          <p>This modal can be closed by clicking the close button, clicking outside the modal, or pressing the ESC key when focusing on the modal.</p>
        </OeModal>
    `,
  }),
};

export const CustomSlotContent: Story = {
  render: () => ({
    components: { OeModal, VlButton, VlTitle, VlActionGroup },
    setup() {
      const isOpen = ref(false);
      const openModal = () => {
        isOpen.value = true;
      };
      const closeModal = () => {
        isOpen.value = false;
      };

      return { isOpen, openModal, closeModal };
    },
    template: `
        <VlButton @click="openModal">Open Modal with Custom Content</VlButton>
        <OeModal v-model:open="isOpen">
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
    `,
  }),
};

export const ToggleDirective: Story = {
  render: () => ({
    directives: { VlModalToggle },
    components: { OeModal, VlButton, VlActionGroup },
    setup() {
      const isOpen = ref(false);
      const toggleModal = () => {
        isOpen.value = !isOpen.value;
      };

      return { isOpen, toggleModal };
    },
    template: `
        <VlButton v-vl-modal-toggle="'custom-modal'">Toggle Modal</VlButton>
        <OeModal id="custom-modal" title="Toggle Modal Title">
          <p>This modal is toggled using the modal toggle directive.</p>
          <template #modal-footer>
            <VlActionGroup mod-align-center>
              <VlButton v-vl-modal-toggle="'custom-modal'">Close</VlButton>
            </VlActionGroup>
          </template>
        </OeModal>
    `,
  }),
};

export const BackdropCloseDisabled: Story = {
  render: () => ({
    components: { OeModal, VlButton },
    setup() {
      const isOpen = ref(false);
      const openModal = () => {
        isOpen.value = true;
      };
      const closeModal = () => {
        isOpen.value = false;
      };

      return { isOpen, openModal, closeModal };
    },
    template: `
        <VlButton @click="openModal">Open Non-Closable Backdrop Modal</VlButton>
        <OeModal v-model:open="isOpen" mod-disable-backdrop-close title="Non-Closable Backdrop Modal Title">
          <p>This modal cannot be closed by clicking on the backdrop.</p>
          <p>You can only close it using the close button or by pressing the ESC key when focusing on the modal.</p>
          <template #modal-footer>
            <VlButton @click="closeModal">Close</VlButton>
          </template>
        </OeModal>
    `,
  }),
};
