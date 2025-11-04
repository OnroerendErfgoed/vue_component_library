<template>
  <OeModal :id="props.id" mod-large :mod-locked="false" title="Actor toevoegen" class="actor-widget">
    <OeLoader v-if="loading" />
    <template #modal-content>
      <grid
        v-show="state === ActorWidgetState.Grid"
        ref="actorGrid"
        :search-actor="props.searchActor"
        :api="props.api"
        :get-sso-token="props.getSsoToken"
        data-cy="actor-widget-grid"
        :actor-type="props.actorType"
        @set-state-detail="setStateDetail($event)"
        @select-actor="selectActor"
        @set-loading="setLoading"
      ></grid>
      <detail
        v-if="state === ActorWidgetState.Detail"
        :actor="selectedActor as IActor"
        data-cy="actor-widget-detail"
        @set-state-grid="state = ActorWidgetState.Grid"
      ></detail>
      <slot name="dropdown" />
    </template>
    <template #modal-footer>
      <VlActionGroup mod-align-center>
        <VlButton
          data-cy="actor-widget-add-btn"
          mod-primary
          :mod-disabled="!selectedActor || props.disableAddButton"
          @click="addActor()"
        >
          Toevoegen
        </VlButton>
        <VlButton mod-secondary @click="close()">Sluiten</VlButton>
      </VlActionGroup>
    </template>
  </OeModal>
</template>

<script setup lang="ts">
import { VlActionGroup, VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { ref, useTemplateRef } from 'vue';
import OeLoader from '@components/core/dumb/OeLoader.vue';
import OeModal from '@components/core/dumb/OeModal.vue';
import Grid from '@components/smart/OeActorWidgetGrid.vue';
import Detail from '@components/widgets/dumb/OeActorWidgetDetail.vue';
import { ActorService } from '@services/actor.service';
import type { ActorType, IActor } from '@models/actor';

interface IOeActorWidgetProps {
  id: string;
  api: string;
  getSsoToken?: () => Promise<string>;
  actorType?: ActorType;
  searchActor?: string;
  disableAddButton?: boolean;
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
  searchActor: '',
  disableAddButton: false,
});

const emit = defineEmits<{
  add: [IActor];
  close: [void];
}>();
const state = ref<ActorWidgetState>(ActorWidgetState.Grid);
const actorService = new ActorService(props.api, props.getSsoToken);
const selectedActor = ref<IActor>();
const loading = ref(false);
const actorGridRef = useTemplateRef('actorGrid');

const selectActor = (actor?: IActor) => (selectedActor.value = actor);

const setLoading = (bool: boolean) => {
  loading.value = bool;
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
  actorGridRef.value?.resetSelectedActor();
  state.value = ActorWidgetState.Grid;
  selectedActor.value = undefined;
};

defineExpose({ selectedActor });
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables';
.actor-widget {
  :deep(h2.vl-title) {
    color: $primary-color;
  }
}

// Fix voor issue v-show - display: none wordt overschreven door vl-u-flex doordat deze !important gebruikt
// Ref. https://github.com/vuejs/vue/issues/3761#issuecomment-251545116
*[style*='display: none'] {
  display: none !important;
}
</style>
