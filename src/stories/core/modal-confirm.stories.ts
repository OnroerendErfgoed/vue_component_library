import { VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import { OeModalConfirm } from '@components/core';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeModalConfirm> = {
  title: 'Core Module/Modal Confirm',
  component: OeModalConfirm,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    onConfirm: { action: 'confirm' },
    onCancel: { action: 'cancel' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Item verwijderen',
    confirmLabel: 'Verwijderen',
    cancelLabel: 'Annuleren',
  },
  render: (args) => ({
    components: { OeModalConfirm, VlButton },
    setup() {
      const open = ref(false);
      return { args, open };
    },
    template: `
      <VlButton @click="open = true">Item verwijderen</VlButton>
      <OeModalConfirm v-model:open="open" v-bind="args" @cancel="open = false">
        <p>Ben je zeker dat je dit item wilt verwijderen?</p>
      </OeModalConfirm>
    `,
  }),
};
