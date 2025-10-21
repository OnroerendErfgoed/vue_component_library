<template>
  <VlMultiselect
    id="gewest"
    v-model="modelValueComputed"
    data-cy="select-gewest"
    placeholder="Gewest"
    :options="options"
    :mod-multiple="false"
    :disabled="disabled"
    :mod-error="modError"
    :options-limit="optionsLimit"
    :preserve-search="true"
    :custom-label="customLabel"
    @keydown.tab="!modelValueComputed ? $event.preventDefault() : null"
  >
    <template #noResult><span>Geen resultaten gevonden...</span></template>
    <template #noOptions><span>Geen opties beschikbaar</span></template>
  </VlMultiselect>
</template>

<script setup lang="ts">
import { VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { computed } from 'vue';
import type { IGewest } from '@models/locatie';

interface GewestSelectorProps {
  modelValue: string | IGewest | undefined;
  options: IGewest[];
  disabled: boolean;
  modError: boolean;
  optionsLimit: number;
}

const props = withDefaults(defineProps<GewestSelectorProps>(), {
  modelValue: undefined,
  options: () => [],
  disabled: false,
  modError: false,
  optionsLimit: 5000,
});
const emit = defineEmits(['update:modelValue']);

const modelValueComputed = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const customLabel = (option: IGewest) => option.naam;
</script>
