<template>
  <div v-if="!readMode">
    <VlMultiselect
      v-if="isVlaamseGemeenteOrEmpty"
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
      <template #noresults><li class="multiselect-option">Geen resultaten gevonden...</li></template>
      <template #nooptions><li class="multiselect-option">Geen opties beschikbaar</li></template>
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
  </div>
  <VlPropertiesData v-else data-cy="postcode-value">
    {{ selectedPostcode || '-' }}
  </VlPropertiesData>
</template>

<script setup lang="ts">
import { VlInputField, VlMultiselect, VlPropertiesData } from '@govflanders/vl-ui-design-system-vue3';
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
  optionsLimit: number;
  isVlaamseGemeenteOrEmpty: boolean;
  readMode: boolean;
}

const props = withDefaults(defineProps<PostcodeSelectorProps>(), {
  modelValue: undefined,
  options: () => [],
  disabled: false,
  modError: false,
  optionsLimit: 5000,
  isVlaamseGemeenteOrEmpty: true,
  readMode: false,
});
const emit = defineEmits(['update:modelValue']);

const modelValueComputed = computed({
  // When the gemeente is non-Vlaamse (input mode), the bound `modelValue` may still hold the
  // IPostinfo object from initial data — unwrap it so the input shows the postcode string.
  get: () =>
    props.isVlaamseGemeenteOrEmpty || typeof props.modelValue === 'string'
      ? props.modelValue
      : (props.modelValue?.postcode ?? ''),
  set: (v) => emit('update:modelValue', v),
});

const selectedPostcode = computed(() =>
  typeof props.modelValue === 'string' ? props.modelValue : props.modelValue?.postcode
);
</script>
