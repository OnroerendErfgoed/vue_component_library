<template>
  <VlMultiselect
    :id="id"
    data-cy="filter-provincie"
    placeholder="Provincie"
    label="naam"
    mode="single"
    searchable
    object
    value-prop="niscode"
    :can-deselect="false"
    :can-clear="false"
    :options="provincies"
    :model-value="provincieValue"
    @update:model-value="updateValue"
    @keydown.tab="!props.value ? $event.preventDefault() : null"
  >
    <template #noresults><li class="multiselect-option">Geen resultaten gevonden...</li></template>
    <template #nooptions><li class="multiselect-option">Geen opties beschikbaar</li></template>
  </VlMultiselect>
</template>

<script setup lang="ts">
import { VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { Guid } from 'guid-typescript';
import { computed, onBeforeMount, ref } from 'vue';
import { IFilterProvincieProps } from '@components/forms';
import { CrabApiService } from '@services/crab-api.service';
import type { IProvincie } from '@models/locatie';

const id = `filter-provincie-${Guid.create().toString()}`;

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

onBeforeMount(async () => {
  provincies.value = await crabApiService.getProvincies();
});
</script>
