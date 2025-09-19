<template>
  <VlModal
    :id="id"
    :open="open"
    :title="title"
    :closable="closable"
    :mod-locked="modLocked"
    :mod-large="modLarge"
    :mod-medium="modMedium"
    :mod-enable-scroll="modEnableScroll"
    :mod-right="modRight"
    :mod-mobile-right="modMobileRight"
    :mod-left="modLeft"
    :mod-mobile-left="modMobileLeft"
    :mod-bottom="modBottom"
    :mod-top="modTop"
    :mod-mobile-top="modMobileTop"
    :mod-disable-backdrop="modDisableBackdrop"
    :mod-focus-on-close="modFocusOnClose"
    :mod-focus-id="modFocusId"
    :content-role="contentRole"
    :z-index="zIndex"
    :title-tag-name="titleTagName"
    :role="role"
    :close-text="closeText"
    :on-close-hook="onCloseHook"
    @update:open="$emit('update:open', $event)"
  >
    <slot />
  </VlModal>
</template>

<script setup lang="ts">
import { VlModal } from '@govflanders/vl-ui-design-system-vue3';

export interface OeModalProps {
  /** The defined id will tell you which modal was opened or closed */
  id: string;
  /** Open the modal by binding a variable */
  open?: boolean;
  /** Modal title */
  title?: string;
  /** Enables the close button */
  closable?: boolean;
  /** Activates the focus-lock */
  modLocked?: boolean;
  /** Large width variant */
  modLarge?: boolean;
  /** Medium width variant */
  modMedium?: boolean;
  /** Enables background scroll */
  modEnableScroll?: boolean;
  /** Right alignment */
  modRight?: boolean;
  /** Right alignment on mobile */
  modMobileRight?: boolean;
  /** Left alignment */
  modLeft?: boolean;
  /** Left alignment on mobile */
  modMobileLeft?: boolean;
  /** Bottom alignment */
  modBottom?: boolean;
  /** Top alignment */
  modTop?: boolean;
  /** Top alignment on mobile */
  modMobileTop?: boolean;
  /** Disable modal backdrop */
  modDisableBackdrop?: boolean;
  /** Focus on the close button after opening the modal */
  modFocusOnClose?: boolean;
  /** Id of the element that get focus after opening the modal */
  modFocusId?: string;
  /** Content role */
  contentRole?: string;
  /** Optionally override the default z-index for the backdrop */
  zIndex?: number;
  /** Title tag name */
  titleTagName?: string;
  /** Modal role (alert, alertdialog, dialog) */
  role?: string;
  /** Close button text */
  closeText?: string;
  /** Hook function called on close */
  onCloseHook?: () => void;
}

const props = withDefaults(defineProps<OeModalProps>(), {
  open: false,
  title: undefined,
  closable: true,
  modLocked: false,
  modLarge: false,
  modMedium: false,
  modEnableScroll: false,
  modRight: false,
  modMobileRight: false,
  modLeft: false,
  modMobileLeft: false,
  modBottom: false,
  modTop: false,
  modMobileTop: false,
  modDisableBackdrop: false,
  modFocusOnClose: false,
  modFocusId: undefined,
  contentRole: 'region',
  zIndex: undefined,
  titleTagName: 'h2',
  role: 'dialog',
  closeText: 'Sluiten',
  onCloseHook: undefined,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();
</script>

<style lang="scss" scoped>
// Add any OE-specific modal styling here
</style>
