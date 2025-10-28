<template>
  <VlMultiselect
    v-if="isBelgiumOrEmpty"
    :id="$attrs.id"
    v-model="modelValueComputed"
    data-cy="select-gemeente"
    placeholder="Gemeente"
    mode="single"
    searchable
    object
    label="naam"
    value-prop="niscode"
    :can-deselect="false"
    :can-clear="false"
    :options="options"
    :disabled="disabled"
    :mod-error="modError"
    :limit="optionsLimit"
    @keydown.tab="!modelValueComputed ? $event.preventDefault() : null"
  >
    <template #noresults><li class="multiselect-option">Geen resultaten gevonden...</li></template>
    <template #nooptions><li class="multiselect-option">Geen opties beschikbaar</li></template>
  </VlMultiselect>
  <VlInputField
    v-else
    :id="$attrs.id"
    v-model="modelValueComputed"
    data-cy="input-gemeente"
    :mod-error="modError"
    :mod-disabled="disabled"
    mod-block
    placeholder="Gemeente"
  />
</template>

<script setup lang="ts">
import { VlInputField, VlMultiselect, VlPropertiesData } from '@govflanders/vl-ui-design-system-vue3';
import { computed } from 'vue';
import type { IGemeente } from '@models/locatie';

interface GemeenteSelectorProps {
  modelValue: string | IGemeente | undefined;
  options: IGemeente[];
  disabled: boolean;
  modError: boolean;
  optionsLimit: number;
  isBelgiumOrEmpty: boolean;
  readMode: boolean;
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

const modelValueComputed = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});
</script>
