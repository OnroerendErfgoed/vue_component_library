import { VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import { OeModalConfirmCancelChanges } from '@components/core';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeModalConfirmCancelChanges> = {
  title: 'Core Module/Modal Confirm Cancel Changes',
  component: OeModalConfirmCancelChanges,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        iframeHeight: 450,
      },
      description: {
        component: `A specialized modal component for confirming cancellation of unsaved changes.
          \n\rThis component displays a confirmation dialog asking users if they want to discard their unsaved changes.
          \n\r**Features:**
          \n\r- Pre-defined confirmation message in Dutch
          \n\r- Two action buttons: confirm cancellation or keep changes
          \n\r- Emits 'confirm' event when user wants to discard changes
          \n\r- Emits 'close' event when user wants to keep changes
          \n\r**Usage:**
          \n\r\`\`\`vue
          <OeModalConfirmCancelChanges @confirm="handleConfirm" @close="handleClose" />
          \`\`\`
        `,
      },
    },
  },
  argTypes: {
    onConfirm: { action: 'confirm' },
    onClose: { action: 'close' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { OeModalConfirmCancelChanges, VlButton },
    setup() {
      const isVisible = ref(false);
      const result = ref('');

      const showModal = () => {
        isVisible.value = true;
        result.value = '';
      };

      const handleConfirm = () => {
        isVisible.value = false;
        result.value = '✅ User confirmed: discarding changes';
      };

      const handleClose = () => {
        isVisible.value = false;
        result.value = '❌ User cancelled: keeping changes';
      };

      return {
        isVisible,
        showModal,
        handleConfirm,
        handleClose,
        result,
        args,
      };
    },
    template: `
      <div style="padding: 20px;">
        <VlButton @click="showModal">
          Trigger Confirm Cancel Changes Modal
        </VlButton>

        <div v-if="result" style="margin-top: 20px; padding: 15px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px;">
          <strong>Event Result:</strong> {{ result }}
        </div>

        <OeModalConfirmCancelChanges
          v-model:open="isVisible"
          @confirm="handleConfirm"
          @close="handleClose"
        />
      </div>
    `,
  }),
};

export const WithFormContext: Story = {
  render: (args) => ({
    components: { OeModalConfirmCancelChanges, VlButton },
    setup() {
      const isVisible = ref(false);
      const formData = ref({ name: '', email: '' });
      const hasUnsavedChanges = ref(false);
      const statusMessage = ref('');

      const updateForm = () => {
        hasUnsavedChanges.value = true;
        statusMessage.value = '';
      };

      const tryToLeave = () => {
        if (hasUnsavedChanges.value) {
          isVisible.value = true;
          statusMessage.value = '⚠️ Attempting to leave with unsaved changes...';
        } else {
          statusMessage.value = '✅ No unsaved changes, safe to leave';
        }
      };

      const handleConfirm = () => {
        isVisible.value = false;
        hasUnsavedChanges.value = false;
        formData.value = { name: '', email: '' };
        statusMessage.value = '🗑️ Changes discarded, form reset';
      };

      const handleClose = () => {
        isVisible.value = false;
        statusMessage.value = '💾 Staying on form to save changes';
      };

      const saveForm = () => {
        hasUnsavedChanges.value = false;
        statusMessage.value = '✅ Form saved successfully!';
      };

      return {
        isVisible,
        formData,
        hasUnsavedChanges,
        updateForm,
        tryToLeave,
        handleConfirm,
        handleClose,
        saveForm,
        statusMessage,
        args,
      };
    },
    template: `
      <div style="padding: 20px; max-width: 600px;">
        <h3>Example Form with Unsaved Changes Protection</h3>

        <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 4px;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold;">Name:</label>
          <input
            v-model="formData.name"
            @input="updateForm"
            style="width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ccc; border-radius: 4px;"
            placeholder="Enter your name"
          />

          <label style="display: block; margin-bottom: 8px; font-weight: bold;">Email:</label>
          <input
            v-model="formData.email"
            @input="updateForm"
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
            placeholder="Enter your email"
          />
        </div>

        <div style="margin: 20px 0;">
          <VlButton @click="saveForm" :disabled="!hasUnsavedChanges">
            Save Form
          </VlButton>

          <VlButton @click="tryToLeave" style="margin-left: 10px;">
            Leave Page
          </VlButton>
        </div>

        <div style="padding: 10px; background: #e3f2fd; border-radius: 4px; margin-bottom: 15px;">
          <strong>Status:</strong>
          {{ hasUnsavedChanges ? '⚠️ Unsaved changes' : '✅ All changes saved' }}
        </div>

        <div v-if="statusMessage" style="padding: 10px; background: #fff3e0; border: 1px solid #ff9800; border-radius: 4px; margin-bottom: 15px;">
          <strong>Action Result:</strong> {{ statusMessage }}
        </div>

        <OeModalConfirmCancelChanges
          v-model:open="isVisible"
          @confirm="handleConfirm"
          @close="handleClose"
        />
      </div>
    `,
  }),
};
