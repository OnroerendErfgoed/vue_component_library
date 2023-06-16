<template>
  <vl-multiselect
    data-cy="filter-gemeente"
    placeholder="Gemeente"
    :custom-label="customGemeenteLabel"
    :mod-multiple="false"
    :options="gemeenten"
    :preserve-search="true"
    :value="props.value"
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
import type { IFilterGemeenteProps } from '@models/index';
import type { IGemeente } from '@models/locatie';
import { CrabService } from '@services/crab.api-service';
import { ref, onBeforeMount } from 'vue';

const props = withDefaults(defineProps<IFilterGemeenteProps>(), {
  api: '',
  value: undefined,
});
const emit = defineEmits(['update:value']);
const updateValue = (value: IGemeente) => emit('update:value', value);

const crabService = new CrabService(props.api);
const gemeenten = ref<IGemeente[]>([]);
const customGemeenteLabel = (option: IGemeente) => option.naam;

onBeforeMount(async () => {
  gemeenten.value = await crabService.getGemeenten();
});
</script>
