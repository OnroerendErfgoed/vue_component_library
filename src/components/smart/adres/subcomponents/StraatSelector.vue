<template>
  <div>
    <VlMultiselect
      v-if="isBelgiumOrEmpty && !freeText"
      v-model="localValue"
      data-cy="select-straat"
      placeholder="Straat"
      :options="options"
      :disabled="disabled"
      :mod-error="modError"
      :mod-multiple="false"
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
      data-cy="input-straat"
      mod-block
      placeholder="Straat"
      :mod-disabled="disabled"
      :mod-error="modError"
    />
    <button v-if="showToggle" data-cy="action-straat-not-found" class="vl-link" @click="$emit('toggle-free-text')">
      <span v-if="!freeText">Een straat invullen die niet tussen de suggesties staat?</span>
      <span v-else>Toon lijst met suggesties</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { VlInputField, VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { ref, watch } from 'vue';
import type { IStraat } from '@models/locatie';

const props = defineProps({
  modelValue: { type: [Object, String], default: undefined },
  options: { type: Array as () => IStraat[], default: () => [] },
  disabled: { type: Boolean, default: false },
  modError: { type: Boolean, default: false },
  freeText: { type: Boolean, default: false },
  showToggle: { type: Boolean, default: false },
  optionsLimit: { type: Number, default: 5000 },
  isBelgiumOrEmpty: { type: Boolean, default: true },
});
const emit = defineEmits(['update:modelValue', 'toggle-free-text']);
const localValue = ref(props.modelValue);

const customLabel = (option: IStraat) => option.naam;
const filteringSortFunc = (a: IStraat, b: IStraat) => a.naam.localeCompare(b.naam);

watch(
  () => props.modelValue,
  (v) => (localValue.value = v)
);
watch(localValue, (v) => emit('update:modelValue', v));
</script>
