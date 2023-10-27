<template>
  <vl-modal :id="props.id" closable mod-large title="Actor toevoegen">
    <oe-actor-widget-grid></oe-actor-widget-grid>
    <div class="vl-u-flex vl-u-flex-align-center">
      <vl-button class="vl-u-spacer-right--small" mod-secondary @click="close">Sluiten</vl-button>
    </div>
  </vl-modal>
</template>

<script setup lang="ts">
import { VlButton, VlModal } from '@govflanders/vl-ui-design-system-vue3';
import OeActorWidgetGrid from '@components/smart/OeActorWidgetGrid.vue';

const props = defineProps<{ id: string }>();
const emit = defineEmits<{
  close: [void];
}>();

const close = () => {
  emit('close');
};
</script>

<style lang="scss"></style>
