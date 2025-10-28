<template>
  <VlMultiselect
    v-if="!readMode"
    v-model="modelValueComputed"
    data-cy="select-gewest"
    placeholder="Gewest"
    :options="options"
    :disabled="disabled"
    :mod-error="modError"
    :limit="optionsLimit"
    :can-deselect="false"
    :can-clear="false"
    mode="single"
    searchable
    object
    label="naam"
    value-prop="niscode"
    @keydown.tab="!modelValueComputed ? $event.preventDefault() : null"
  >
    <template #noresults><li class="multiselect-option">Geen resultaten gevonden...</li></template>
    <template #nooptions><li class="multiselect-option">Geen opties beschikbaar</li></template>
  </VlMultiselect>
  <VlPropertiesData v-else data-cy="gewest-value">
    {{ selectedGewest || '-' }}
  </VlPropertiesData>
</template>

<script setup lang="ts">
import { VlMultiselect, VlPropertiesData } from '@govflanders/vl-ui-design-system-vue3';
import { computed } from 'vue';
import type { IGewest } from '@models/locatie';

interface GewestSelectorProps {
  modelValue: string | IGewest | undefined;
  options: IGewest[];
  disabled: boolean;
  modError: boolean;
  optionsLimit: number;
  readMode: boolean;
}

const props = withDefaults(defineProps<GewestSelectorProps>(), {
  modelValue: undefined,
  options: () => [],
  disabled: false,
  modError: false,
  optionsLimit: 5000,
  readMode: false,
});
const emit = defineEmits(['update:modelValue']);

const modelValueComputed = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});
</script>
