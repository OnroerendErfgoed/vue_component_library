<template>
  <vl-modal :id="props.id" closable mod-large title="Actor toevoegen">
    <div class="content">
      <oe-loader v-show="loading" />
      <grid
        v-if="state === ActorWidgetState.Grid"
        :service="actorService"
        @set-state-detail="setStateDetail($event)"
        @select-actor="selectActor"
        @toggle-loader="loading = !loading"
      />
      <detail
        v-if="state === ActorWidgetState.Detail"
        :actor="selectedActor"
        @set-state-grid="state = ActorWidgetState.Grid"
      />
      <slot name="dropdown"></slot>
      <div class="vl-u-flex vl-u-flex-align-center">
        <vl-button
          class="vl-u-spacer-right--small"
          mod-primary
          :mod-disabled="!selectedActor"
          @click="emit('add', selectedActor as IActor)"
        >
          Toevoegen
        </vl-button>
        <vl-button class="vl-u-spacer-right--small" mod-secondary @click="emit('close')">Sluiten</vl-button>
      </div>
    </div>
  </vl-modal>
</template>

<script setup lang="ts">
import { VlButton, VlModal } from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import OeLoader from '@components/dumb/OeLoader.vue';
import Detail from '@components/smart/OeActorWidgetDetail.vue';
import Grid from '@components/smart/OeActorWidgetGrid.vue';
import { ActorService } from '@services/actor.service';
import type { IActor } from '@models/actor';

interface IOeActorWidgetProps {
  id: string;
  api: string;
  getSsoToken: () => Promise<string>;
}

enum ActorWidgetState {
  Grid,
  Detail,
}

const props = withDefaults(defineProps<IOeActorWidgetProps>(), {
  id: '',
  api: '',
  getSsoToken: undefined,
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
</script>

<style lang="scss" scoped></style>
