<template>
  <vl-multiselect
    data-cy="filter-provincie"
    placeholder="Provincie"
    :custom-label="customProvincieLabel"
    :mod-multiple="false"
    :options="provincies"
    :preserve-search="true"
    :value="provincieValue"
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
import { IFilterProvincieProps } from '@components/forms';
import { CrabApiService } from '@services/crab-api.service';
import type { IProvincie } from '@models/locatie';

const props = withDefaults(defineProps<IFilterProvincieProps>(), {
  api: '',
  value: undefined,
});
const emit = defineEmits(['update:value']);

const provincieValue = computed(() => {
  return provincies.value.length
    ? provincies.value.find((g) => g.niscode === props.value || g.naam === props.value)
    : undefined;
});
const updateValue = (value: IProvincie) => emit('update:value', value);

const crabApiService = new CrabApiService(props.api);
const provincies = ref<IProvincie[]>([]);
const customProvincieLabel = (option: IProvincie) => option.naam;

onBeforeMount(async () => {
  provincies.value = await crabApiService.getProvincies();
});
</script>
