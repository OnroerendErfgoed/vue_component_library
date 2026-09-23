<template>
  <OeModal :title="title" mod-disable-backdrop-close>
    <slot />

    <template #modal-footer>
      <VlActionGroup mod-align-center>
        <VlButton data-cy="confirm-button" @click="emit('confirm')">
          {{ confirmLabel }}
        </VlButton>
        <VlButton data-cy="cancel-button" @click="emit('cancel')">
          {{ cancelLabel }}
        </VlButton>
      </VlActionGroup>
    </template>
  </OeModal>
</template>

<script setup lang="ts">
import { VlActionGroup, VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { OeModal } from '@/core';

withDefaults(
  defineProps<{
    title: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }>(),
  {
    confirmLabel: 'OK',
    cancelLabel: 'Annuleren',
  }
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>
