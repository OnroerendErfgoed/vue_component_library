<template>
  <div v-show="open" class="oe-modal-wrapper">
    <!-- Custom backdrop -->
    <div v-if="modDisableBackdropClose" class="oe-modal-backdrop" @click="handleBackdropClick" />
    <!-- VlModal on top -->
    <VlModal
      v-bind="$attrs"
      :id="id"
      :open="open"
      :mod-locked="modLocked"
      :mod-disable-backdrop="modDisableBackdropClose"
      @update:open="open = $event"
    >
      <slot />
      <template v-if="$slots['modal-header']" #modal-header>
        <slot name="modal-header" />
      </template>
      <template v-if="$slots['modal-content']" #modal-content>
        <slot name="modal-content" />
      </template>
      <template v-if="$slots['modal-footer']" #modal-footer>
        <slot name="modal-footer" />
      </template>
    </VlModal>
  </div>
</template>

<script setup lang="ts">
import { VlModal } from '@govflanders/vl-ui-design-system-vue3';
import { Guid } from 'guid-typescript';
import { ExtractPropTypes } from 'vue';

type VlModalPropTypes = ExtractPropTypes<typeof VlModal.props>;

export interface OeModalProps extends /* @vue-ignore */ VlModalPropTypes {
  id?: string;
  modLocked?: boolean;
  modDisableBackdropClose?: boolean;
}

const open = defineModel<boolean>('open', { default: false });

const props = withDefaults(defineProps<OeModalProps>(), {
  id: Guid.create().toString(),
  modLocked: true,
  modDisableBackdropClose: false,
});

function handleBackdropClick() {
  if (!props.modDisableBackdropClose) {
    open.value = false;
  }
}
</script>

<style lang="scss" scoped>
.oe-modal-backdrop {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10008;
  background-color: rgba(232, 235, 238, 0.95);
  opacity: 0.95;
}
</style>
