<template>
  <vl-multiselect
    data-cy="filter-actor"
    placeholder="Actor"
    :mod-multiple="false"
    :options="actoren"
    :preserve-search="true"
    :value="actorValue"
    @update:value="updateValue"
    :custom-label="customActorLabel"
    @keydown.tab="!props.value ? $event.preventDefault() : null"
  >
    <template #noResult>
      <span>Geen actoren gevonden...</span>
    </template>
    <template #noOptions>
      <span>Geen opties beschikbaar</span>
    </template>
  </vl-multiselect>
</template>

<script setup lang="ts">
import { VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { sortBy } from 'lodash';
import { computed, onBeforeMount, ref } from 'vue';
import { ActorService } from '@services/actor.service';
import type { IActor } from '@models/actor';
import type { IFilterActorProps } from '@models/index';

const props = withDefaults(defineProps<IFilterActorProps>(), {
  api: '',
  actoren: undefined,
  getSsoToken: undefined,
  value: undefined,
});
const emit = defineEmits(['update:value']);

const actorValue = computed(() => {
  return actoren.value.length ? actoren.value.find((actor) => actor.uri === props.value) : undefined;
});
const updateValue = (value: IActor) => emit('update:value', value);

const actorService = new ActorService(props.api, props.getSsoToken);
const actoren = ref<IActor[]>([]);
const customActorLabel = (option: IActor) => option.omschrijving;

onBeforeMount(async () => {
  if (props.actoren) {
    actoren.value = sortBy(props.actoren, 'omschrijving');
  } else {
    const apiActoren = await actorService.getAOEActoren();
    actoren.value = sortBy(apiActoren, 'omschrijving');
  }
});
</script>
