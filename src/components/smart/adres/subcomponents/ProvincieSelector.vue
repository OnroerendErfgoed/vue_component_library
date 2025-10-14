<template>
  <VlMultiselect
    v-model="localValue"
    data-cy="select-provincie"
    placeholder="Provincie"
    :options="options"
    :mod-multiple="false"
    :disabled="disabled"
    :mod-error="modError"
    :options-limit="optionsLimit"
    :preserve-search="true"
    :custom-label="customLabel"
    @keydown.tab="!localValue ? $event.preventDefault() : null"
  >
    <template #noResult><span>Geen resultaten gevonden...</span></template>
    <template #noOptions><span>Geen opties beschikbaar</span></template>
  </VlMultiselect>
</template>

<script setup lang="ts">
import { VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { ref, watch } from 'vue';
import type { IProvincie } from '@models/locatie';

const props = defineProps({
  modelValue: { type: [Object, String], default: undefined },
  options: { type: Array as () => IProvincie[], default: () => [] },
  disabled: { type: Boolean, default: false },
  modError: { type: Boolean, default: false },
  optionsLimit: { type: Number, default: 5000 },
});
const emit = defineEmits(['update:modelValue']);
const localValue = ref(props.modelValue);

const customLabel = (option: IProvincie) => option.naam;

watch(
  () => props.modelValue,
  (v) => (localValue.value = v),
  { deep: true }
);
watch(localValue, (v) => emit('update:modelValue', v), { deep: true });
</script>
