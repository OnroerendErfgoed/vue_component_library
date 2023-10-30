<template>
  <!--<vl-modal :id="props.id" closable mod-large title="Actor toevoegen">-->
  <div class="content">
    <oe-actor-widget-grid :service="actorService"></oe-actor-widget-grid>
    <div class="vl-u-flex vl-u-flex-align-center">
      <vl-button class="vl-u-spacer-right--small" mod-secondary @click="close">Sluiten</vl-button>
    </div>
  </div>
  <!--</vl-modal>-->
</template>

<script setup lang="ts">
import { VlButton, VlModal } from '@govflanders/vl-ui-design-system-vue3';
import OeActorWidgetGrid from '@components/smart/OeActorWidgetGrid.vue';
import { ActorService } from '@services/actor.service';

interface IOeActorWidgetProps {
  id: string;
  api: string;
  getSsoToken: () => Promise<string>;
}

const props = withDefaults(defineProps<IOeActorWidgetProps>(), {
  id: '',
  api: '',
  getSsoToken: undefined,
});
const emit = defineEmits<{
  close: [void];
}>();
const actorService = new ActorService(props.api, props.getSsoToken);

const close = () => {
  emit('close');
};
</script>

<style lang="scss" scoped></style>
