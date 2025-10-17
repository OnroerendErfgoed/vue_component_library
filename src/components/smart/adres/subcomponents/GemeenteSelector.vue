<template>
  <VlMultiselect
    v-if="isBelgiumOrEmpty"
    v-model="modelValue"
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
    @keydown.tab="!modelValue ? $event.preventDefault() : null"
  >
    <template #noResult><span>Geen resultaten gevonden...</span></template>
    <template #noOptions><span>Geen opties beschikbaar</span></template>
  </VlMultiselect>
  <VlInputField
    v-else
    v-model="modelValue"
    data-cy="input-gemeente"
    :mod-error="modError"
    :mod-disabled="disabled"
    mod-block
    placeholder="Gemeente"
  />
</template>

<script setup lang="ts">
import { VlInputField, VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { computed } from 'vue';
import type { IGemeente } from '@models/locatie';

interface GemeenteSelectorProps {
  modelValue: string | IGemeente;
  options: IGemeente[];
  disabled: boolean;
  modError: boolean;
  optionsLimit: number;
  isBelgiumOrEmpty: boolean;
}

const props = withDefaults(defineProps<GemeenteSelectorProps>(), {
  modelValue: undefined,
  options: () => [],
  disabled: false,
  modError: false,
  optionsLimit: 5000,
  isBelgiumOrEmpty: true,
});
const emit = defineEmits(['update:modelValue']);

const modelValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const customLabel = (option: IGemeente) => option.naam;
const filteringSortFunc = (a: IGemeente, b: IGemeente) => a.naam.localeCompare(b.naam);
</script>
