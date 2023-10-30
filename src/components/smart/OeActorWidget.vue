<template>
  <!--<vl-modal :id="props.id" closable mod-large title="Actor toevoegen">-->
  <div class="content">
    <div class="vl-u-flex vl-u-flex-align-center">
      <vl-button class="vl-u-spacer-right--small" mod-primary @click="state = ActorWidgetState.Table">
        Overzicht
      </vl-button>
      <vl-button mod-primary @click="state = ActorWidgetState.Filters"> Uitgebreid zoeken </vl-button>
    </div>
    <oe-actor-widget-grid
      v-if="state === ActorWidgetState.Table"
      :service="actorService"
      @set-state-detail="state = ActorWidgetState.Detail"
    />
    <div class="vl-u-flex vl-u-flex-align-center">
      <vl-button class="vl-u-spacer-right--small" mod-secondary @click="close">Sluiten</vl-button>
    </div>
  </div>
  <!--</vl-modal>-->
</template>

<script setup lang="ts">
import { VlButton, VlModal } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import OeActorWidgetGrid from '@components/smart/OeActorWidgetGrid.vue';
import { ActorService } from '@services/actor.service';

interface IOeActorWidgetProps {
  id: string;
  api: string;
  getSsoToken: () => Promise<string>;
}

enum ActorWidgetState {
  Table = 'table',
  Filters = 'filters',
  Detail = 'detail',
}

const props = withDefaults(defineProps<IOeActorWidgetProps>(), {
  id: '',
  api: '',
  getSsoToken: undefined,
});
const emit = defineEmits<{
  close: [void];
}>();
const state = ref<ActorWidgetState>(ActorWidgetState.Table);
const actorService = new ActorService(props.api, props.getSsoToken);

const close = () => {
  emit('close');
};
</script>

<style lang="scss" scoped></style>
