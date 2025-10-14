<template>
  <VlMultiselect
    v-if="isBelgiumOrEmpty"
    v-model="localValue"
    data-cy="select-gemeente"
    placeholder="Gemeente"
    :options="options"
    :mod-multiple="false"
    :disabled="disabled"
    :mod-error="modError"
    :options-limit="optionsLimit"
    :preserve-search="true"
    :custom-label="customLabel"
    :filtering-sort-func="filteringSortFunc"
    @keydown.tab="!localValue ? $event.preventDefault() : null"
  >
    <template #noResult><span>Geen resultaten gevonden...</span></template>
    <template #noOptions><span>Geen opties beschikbaar</span></template>
  </VlMultiselect>
  <VlInputField
    v-else
    v-model="localValue"
    data-cy="input-gemeente"
    :mod-error="modError"
    :mod-disabled="disabled"
    mod-block
    placeholder="Gemeente"
  />
</template>

<script setup lang="ts">
import { VlInputField, VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { ref, watch } from 'vue';
import type { IGemeente } from '@models/locatie';

const props = defineProps({
  modelValue: { type: [Object, String], default: undefined },
  options: { type: Array as () => IGemeente[], default: () => [] },
  disabled: { type: Boolean, default: false },
  modError: { type: Boolean, default: false },
  optionsLimit: { type: Number, default: 5000 },
  isBelgiumOrEmpty: { type: Boolean, default: true },
});
const emit = defineEmits(['update:modelValue']);
const localValue = ref(props.modelValue);

const customLabel = (option: IGemeente) => option.naam;
const filteringSortFunc = (a: IGemeente, b: IGemeente) => a.naam.localeCompare(b.naam);

watch(
  () => props.modelValue,
  (v) => (localValue.value = v),
  { deep: true }
);
watch(localValue, (v) => emit('update:modelValue', v), { deep: true });
</script>
