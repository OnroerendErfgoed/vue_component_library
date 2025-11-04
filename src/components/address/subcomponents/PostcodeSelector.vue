<template>
  <div>
    <VlMultiselect
      v-if="isBelgiumOrEmpty && !freeText"
      :id="$attrs.id"
      v-model="modelValueComputed"
      data-cy="select-postcode"
      placeholder="Postcode"
      mode="single"
      searchable
      object
      label="postcode"
      value-prop="uri"
      :options="options"
      :disabled="disabled"
      :mod-error="modError"
      :mod-multiple="false"
      :limit="optionsLimit"
      @keydown.tab="!modelValueComputed ? $event.preventDefault() : null"
    >
      <template #noresults><span>Geen resultaten gevonden...</span></template>
      <template #nooptions><span>Geen opties beschikbaar</span></template>
    </VlMultiselect>
    <VlInputField
      v-else
      :id="$attrs.id"
      v-model="modelValueComputed"
      data-cy="input-postcode"
      mod-block
      placeholder="Postcode"
      :mod-disabled="disabled"
      :mod-error="modError"
    />
    <VlButton v-if="showToggle" data-cy="action-postcode-not-found" mod-link @click="$emit('toggle-free-text')">
      <span v-if="!freeText">Een postcode invullen die niet tussen de suggesties staat?</span>
      <span v-else>Toon lijst met suggesties</span>
    </VlButton>
  </div>
</template>

<script setup lang="ts">
import { VlButton, VlInputField, VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import { computed } from 'vue';
import type { IPostinfo } from '@models/locatie';

defineOptions({
  inheritAttrs: false,
});

interface PostcodeSelectorProps {
  modelValue: string | IPostinfo | undefined;
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

const modelValueComputed = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});
</script>
