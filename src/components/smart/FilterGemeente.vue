<template>
  <vl-multiselect
    data-cy="filter-gemeente"
    placeholder="Gemeente"
    :custom-label="customGemeenteLabel"
    :mod-multiple="false"
    :options="gemeenten"
    :preserve-search="true"
    :value="gemeenteValue"
    @update:value="updateValue"
    @keydown.tab="!props.value ? $event.preventDefault() : null"
  >
    <template #noResult>
      <span>Geen resultaten gevonden...</span>
    </template>
    <template #noOptions>
      <span>Geen opties beschikbaar</span>
    </template>
  </vl-multiselect>
</template>

<script setup lang="ts">
import { VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { computed, onBeforeMount, ref } from 'vue';
import { CrabApiService } from '@services/crab-api.service';
import type { IFilterGemeenteProps } from '@models/index';
import type { IGemeente } from '@models/locatie';

const props = withDefaults(defineProps<IFilterGemeenteProps>(), {
  api: '',
  value: undefined,
});
const emit = defineEmits(['update:value']);

const gemeenteValue = computed(() => {
  return gemeenten.value.length ? gemeenten.value.find((g) => g.niscode === props.value) : undefined;
});
const updateValue = (value: IGemeente) => emit('update:value', value);

const crabApiService = new CrabApiService(props.api);
const gemeenten = ref<IGemeente[]>([]);
const customGemeenteLabel = (option: IGemeente) => option.naam;

onBeforeMount(async () => {
  gemeenten.value = await crabApiService.getGemeenten();
});
</script>
