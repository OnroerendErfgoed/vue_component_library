<template>
  <div>
    <VlMultiselect
      v-if="isBelgiumOrEmpty && !freeText"
      :id="$attrs.id"
      v-model="modelValueComputed"
      data-cy="select-straat"
      placeholder="Straat"
      mode="single"
      searchable
      object
      label="naam"
      value-prop="uri"
      :can-deselect="false"
      :can-clear="false"
      :options="options"
      :disabled="disabled"
      :mod-error="modError"
      :limit="optionsLimit"
      @keydown.tab="!modelValue ? $event.preventDefault() : null"
    >
      <template #noresults><span>Geen resultaten gevonden...</span></template>
      <template #nooptions><span>Geen opties beschikbaar</span></template>
    </VlMultiselect>
    <VlInputField
      v-else
      :id="$attrs.id"
      v-model="modelValueComputed"
      data-cy="input-straat"
      mod-block
      placeholder="Straat"
      :mod-disabled="disabled"
      :mod-error="modError"
    />
    <VlButton v-if="showToggle" data-cy="action-straat-not-found" mod-link @click="$emit('toggle-free-text')">
      <span v-if="!freeText">Een straat invullen die niet tussen de suggesties staat?</span>
      <span v-else>Toon lijst met suggesties</span>
    </VlButton>
  </div>
</template>

<script setup lang="ts">
import { VlButton, VlInputField, VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { computed } from 'vue';
import type { IStraat } from '@models/locatie';

defineOptions({
  inheritAttrs: false,
});

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
</script>
