<template>
  <vl-modal :id="props.id" mod-large title="Actor toevoegen" class="actor-widget">
    <oe-loader v-if="loading"></oe-loader>
    <template #modal-content>
      <grid
        v-if="state === ActorWidgetState.Grid"
        :api="props.api"
        :get-sso-token="props.getSsoToken"
        data-cy="actor-widget-grid"
        :actor-type="props.actorType"
        @set-state-detail="setStateDetail($event)"
        @select-actor="selectActor"
        @toggle-loader="loading = !loading"
      ></grid>
      <detail
        v-if="state === ActorWidgetState.Detail"
        :actor="selectedActor"
        data-cy="actor-widget-detail"
        @set-state-grid="state = ActorWidgetState.Grid"
      ></detail>
      <slot name="dropdown"></slot>
    </template>
    <template #modal-footer>
      <div class="vl-u-flex vl-u-flex-align-center">
        <vl-button
          data-cy="actor-widget-add-btn"
          class="vl-u-spacer-right--small"
          mod-primary
          :mod-disabled="!selectedActor"
          @click="addActor()"
        >
          Toevoegen
        </vl-button>
        <vl-button class="vl-u-spacer-right--small" mod-secondary @click="close()">Sluiten</vl-button>
      </div>
    </template>
  </vl-modal>
</template>

<script setup lang="ts">
import { VlButton, VlModal } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import OeLoader from '@components/dumb/OeLoader.vue';
import Detail from '@components/smart/OeActorWidgetDetail.vue';
import Grid from '@components/smart/OeActorWidgetGrid.vue';
import { ActorService } from '@services/actor.service';
import type { ActorType, IActor } from '@models/actor';

interface IOeActorWidgetProps {
  id: string;
  api: string;
  getSsoToken: () => Promise<string>;
  actorType?: ActorType;
}

enum ActorWidgetState {
  Grid,
  Detail,
}

const props = withDefaults(defineProps<IOeActorWidgetProps>(), {
  id: '',
  api: '',
  getSsoToken: undefined,
  actorType: undefined,
});
const emit = defineEmits<{
  add: [IActor];
  close: [void];
}>();
const state = ref<ActorWidgetState>(ActorWidgetState.Grid);
const actorService = new ActorService(props.api, props.getSsoToken);
const selectedActor = ref<IActor>();
const loading = ref(false);

const selectActor = (actor: IActor) => {
  selectedActor.value = actor;
};

const setStateDetail = async (id: number) => {
  loading.value = true;
  try {
    selectedActor.value = await actorService.getActorById(id);
    state.value = ActorWidgetState.Detail;
  } catch (e) {
    console.debug(e);
  }
  loading.value = false;
};

const addActor = () => {
  emit('add', selectedActor.value as IActor);
  resetWidget();
};

const close = () => {
  emit('close');
  resetWidget();
};

const resetWidget = () => {
  state.value = ActorWidgetState.Grid;
  selectedActor.value = undefined;
};
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables';
.actor-widget {
  :deep(h2.vl-title) {
    color: $primary-color;
  }
}
</style>
