<template>
  <VlMultiselect
    id="provincie"
    v-model="modelValueComputed"
    data-cy="select-provincie"
    placeholder="Provincie"
    mode="single"
    :options="options"
    :disabled="disabled"
    :mod-error="modError"
    :limit="optionsLimit"
    :can-deselect="false"
    :can-clear="false"
    searchable
    object
    label="naam"
    value-prop="niscode"
    @keydown.tab="!modelValueComputed ? $event.preventDefault() : null"
  >
    <template #noresults><span>Geen resultaten gevonden...</span></template>
    <template #nooptions><span>Geen opties beschikbaar</span></template>
  </VlMultiselect>
</template>

<script setup lang="ts">
import { VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { computed } from 'vue';
import type { IProvincie } from '@models/locatie';

interface ProvincieSelectorProps {
  modelValue: string | IProvincie | undefined;
  options: IProvincie[];
  disabled: boolean;
  modError: boolean;
  optionsLimit: number;
}

const props = withDefaults(defineProps<ProvincieSelectorProps>(), {
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
