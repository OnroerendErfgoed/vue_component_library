<template>
  <div>
    <VlMultiselect
      v-if="isBelgiumOrEmpty && !freeText"
      v-model="modelValueComputed"
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
      @keydown.tab="!modelValue ? $event.preventDefault() : null"
    >
      <template #noResult><span>Geen resultaten gevonden...</span></template>
      <template #noOptions><span>Geen opties beschikbaar</span></template>
    </VlMultiselect>
    <VlInputField
      v-else
      v-model="modelValueComputed"
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
import { computed } from 'vue';
import type { IStraat } from '@models/locatie';

interface StraatSelectorProps {
  modelValue: string | IStraat | undefined;
  options: IStraat[];
  disabled: boolean;
  modError: boolean;
  freeText: boolean;
  showToggle: boolean;
  optionsLimit: number;
  isBelgiumOrEmpty: boolean;
}

const props = withDefaults(defineProps<StraatSelectorProps>(), {
  modelValue: undefined,
  options: () => [],
  disabled: false,
  modError: false,
  freeText: false,
  showToggle: false,
  optionsLimit: 5000,
  isBelgiumOrEmpty: true,
});
const emit = defineEmits(['update:modelValue', 'toggle-free-text']);

const modelValueComputed = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const customLabel = (option: IStraat) => option.naam;
const filteringSortFunc = (a: IStraat, b: IStraat) => a.naam.localeCompare(b.naam);
</script>
