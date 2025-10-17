<template>
  <VlMultiselect
    v-model="modelValue"
    data-cy="select-provincie"
    placeholder="Provincie"
    :options="options"
    :mod-multiple="false"
    :disabled="disabled"
    :mod-error="modError"
    :options-limit="optionsLimit"
    :preserve-search="true"
    :custom-label="customLabel"
    @keydown.tab="!modelValue ? $event.preventDefault() : null"
  >
    <template #noResult><span>Geen resultaten gevonden...</span></template>
    <template #noOptions><span>Geen opties beschikbaar</span></template>
  </VlMultiselect>
</template>

<script setup lang="ts">
import { VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { computed } from 'vue';
import type { IProvincie } from '@models/locatie';

interface ProvincieSelectorProps {
  modelValue: string | IProvincie;
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

const modelValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const customLabel = (option: IProvincie) => option.naam;
</script>
