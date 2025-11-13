<template>
  <VlMultiselect
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
</script>
