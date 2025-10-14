<template>
  <div>
    <VlMultiselect
      v-if="isBelgiumOrEmpty && !freeText"
      v-model="localValue"
      data-cy="select-postcode"
      placeholder="Postcode"
      :options="options"
      :disabled="disabled"
      :mod-error="modError"
      :mod-multiple="false"
      :options-limit="optionsLimit"
      :preserve-search="true"
      :custom-label="customLabel"
      @keydown.tab="!localValue ? $event.preventDefault() : null"
    >
      <template #noResult><span>Geen resultaten gevonden...</span></template>
      <template #noOptions><span>Geen opties beschikbaar</span></template>
    </VlMultiselect>
    <VlInputField
      v-else
      v-model="localValue"
      data-cy="input-postcode"
      mod-block
      placeholder="Postcode"
      :mod-disabled="disabled"
      :mod-error="modError"
    />
    <button v-if="showToggle" data-cy="action-postcode-not-found" class="vl-link" @click="$emit('toggle-free-text')">
      <span v-if="!freeText">Een postcode invullen die niet tussen de suggesties staat?</span>
      <span v-else>Toon lijst met suggesties</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { VlInputField, VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { ref, watch } from 'vue';
import type { IPostinfo } from '@models/locatie';

const props = defineProps({
  modelValue: { type: [Object, String], default: undefined },
  options: { type: Array as () => IPostinfo[], default: () => [] },
  disabled: { type: Boolean, default: false },
  modError: { type: Boolean, default: false },
  freeText: { type: Boolean, default: false },
  showToggle: { type: Boolean, default: true },
  optionsLimit: { type: Number, default: 5000 },
  isBelgiumOrEmpty: { type: Boolean, default: true },
});
const emit = defineEmits(['update:modelValue', 'toggle-free-text']);
const localValue = ref(props.modelValue);

const customLabel = (option: IPostinfo) => option.postcode;

watch(
  () => props.modelValue,
  (v) => (localValue.value = v)
);
watch(localValue, (v) => emit('update:modelValue', v));
</script>
