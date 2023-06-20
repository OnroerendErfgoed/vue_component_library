<template>
  <vl-multiselect
    data-cy="filter-aanduidingsobject"
    placeholder="Aanduidingsobject"
    :custom-label="customAanduidingsobjectLabel"
    :mod-multiple="false"
    :options="aanduidingsobjecten"
    :preserve-search="true"
    :value="aanduidingsobjectValue"
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
import type { IAanduidingsobject, IFilterAanduidingsobjectProps } from '@models/index';
import { InventarisApiService } from '@services/inventaris-api.service';
import { computed, onBeforeMount, ref } from 'vue';

const props = withDefaults(defineProps<IFilterAanduidingsobjectProps>(), {
  api: '',
  value: undefined,
});
const emit = defineEmits(['update:value']);

const aanduidingsobjectValue = computed(() => {
  return aanduidingsobjecten.value.length ? aanduidingsobjecten.value.find((g) => g.uri === props.value) : undefined;
});
const updateValue = (value: IAanduidingsobject) => emit('update:value', value);

const inventarisApiService = new InventarisApiService(props.api);
const aanduidingsobjecten = ref<IAanduidingsobject[]>([]);
const customAanduidingsobjectLabel = (option: IAanduidingsobject) => option.aanduidingsobjectLabel;

onBeforeMount(async () => {
  aanduidingsobjecten.value = await inventarisApiService.getAanduidingsobjecten();
});
</script>
