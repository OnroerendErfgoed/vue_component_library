<template>
  <VlMultiselect
    data-cy="filter-gemeente"
    placeholder="Gemeente"
    label="naam"
    mode="single"
    searchable
    object
    value-prop="niscode"
    :can-deselect="false"
    :can-clear="false"
    :options="gemeenten"
    :preserve-search="true"
    :model-value="gemeenteValue"
    @update:model-value="updateValue"
    @keydown.tab="!props.value ? $event.preventDefault() : null"
  >
    <template #noresults><li class="multiselect-option">Geen resultaten gevonden...</li></template>
    <template #nooptions><li class="multiselect-option">Geen opties beschikbaar</li></template>
  </VlMultiselect>
</template>

<script setup lang="ts">
import { IFilterGemeenteProps } from '../models/filter';
import { VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { computed, onBeforeMount, ref } from 'vue';
import { Niscode } from '@models/niscode.enum';
import { CrabApiService } from '@services/crab-api.service';
import type { IGemeente } from '@models/locatie';

const props = withDefaults(defineProps<IFilterGemeenteProps>(), {
  api: '',
  value: undefined,
  gewest: undefined,
});
const emit = defineEmits(['update:value']);

const gemeenteValue = computed(() => {
  return gemeenten.value.length ? gemeenten.value.find((g) => g.niscode === props.value) : undefined;
});
const updateValue = (value: IGemeente) => emit('update:value', value);

const crabApiService = new CrabApiService(props.api);
const gemeenten = ref<IGemeente[]>([]);

onBeforeMount(async () => {
  const data = await crabApiService.getGemeenten();
  switch (props.gewest) {
    case Niscode.VlaamsGewest:
      gemeenten.value = crabApiService.vlaamseGemeenten;
      break;
    case Niscode.WaalsGewest:
      gemeenten.value = crabApiService.waalseGemeenten;
      break;
    case Niscode.BrusselsHoofdstedelijkGewest:
      gemeenten.value = crabApiService.brusselseGemeenten;
      break;
    default:
      gemeenten.value = data;
  }
});
</script>
