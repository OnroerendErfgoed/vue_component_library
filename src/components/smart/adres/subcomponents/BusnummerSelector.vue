<template>
  <div>
    <OeAutocomplete
      v-if="isBelgiumOrEmpty && !huisnummerIsFreeText && !freeText"
      data-cy="autocomplete-busnummer"
      allow-free-text
      autoselect
      :mod-error="modError"
      :min-chars="1"
      :mod-disabled="disabled"
      :value="autocompleteOption"
      :callback-fn="autocompleteFn"
      placeholder="Busnummer"
      @update:value="onUpdate"
    />
    <VlInputField
      v-else
      v-model="localString"
      data-cy="input-busnummer"
      mod-block
      placeholder="Busnummer"
      :mod-disabled="disabled"
      :mod-error="modError"
    />
  </div>
</template>

<script setup lang="ts">
import { VlInputField } from '@govflanders/vl-ui-design-system-vue3';
import { computed, ref, watch } from 'vue';
import OeAutocomplete from '@components/dumb/OeAutocomplete.vue';
import type { IAutocompleteOption } from '@models/autocomplete';
import type { IAdres } from '@models/locatie';

const props = defineProps({
  modelValue: { type: [Object, String], default: undefined },
  disabled: { type: Boolean, default: false },
  freeText: { type: Boolean, default: false },
  modError: { type: Boolean, default: false },
  autocompleteFn: { type: Function, default: undefined },
  isBelgiumOrEmpty: { type: Boolean, default: true },
  huisnummerIsFreeText: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

const localString = ref(
  typeof props.modelValue === 'string' ? props.modelValue : (props.modelValue as IAdres)?.busnummer || ''
);

const autocompleteOption = computed(() => ({
  title: typeof props.modelValue !== 'string' ? (props.modelValue as IAdres)?.busnummer : props.modelValue,
  value: props.modelValue,
}));

watch(
  () => props.modelValue,
  (v) => {
    if (typeof v === 'string') localString.value = v;
    else if (v && typeof v === 'object') localString.value = (v as IAdres).busnummer || '';
  }
);

watch(localString, (v) => emit('update:modelValue', v));

const autocompleteFn = (term: string) => props.autocompleteFn?.(term) ?? Promise.resolve([]);
const onUpdate = (opt: IAutocompleteOption) => emit('update:modelValue', opt?.value);
</script>
