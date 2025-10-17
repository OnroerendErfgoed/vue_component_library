<template>
  <div>
    <VlMultiselect
      v-if="isBelgiumOrEmpty && !freeText"
      v-model="modelValue"
      data-cy="select-postcode"
      placeholder="Postcode"
      :options="options"
      :disabled="disabled"
      :mod-error="modError"
      :mod-multiple="false"
      :options-limit="optionsLimit"
      :preserve-search="true"
      :custom-label="customLabel"
      @keydown.tab="!modelValue ? $event.preventDefault() : null"
    >
      <template #noResult><span>Geen resultaten gevonden...</span></template>
      <template #noOptions><span>Geen opties beschikbaar</span></template>
    </VlMultiselect>
    <VlInputField
      v-else
      v-model="modelValue"
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
import { computed } from 'vue';
import type { IPostinfo } from '@models/locatie';

interface PostcodeSelectorProps {
  modelValue: string | IPostinfo;
  options: IPostinfo[];
  disabled: boolean;
  modError: boolean;
  freeText: boolean;
  showToggle: boolean;
  optionsLimit: number;
  isBelgiumOrEmpty: boolean;
}

const props = withDefaults(defineProps<PostcodeSelectorProps>(), {
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

const modelValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const customLabel = (option: IPostinfo) => option.postcode;
</script>
