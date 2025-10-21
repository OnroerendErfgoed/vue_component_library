<template>
  <div>
    <OeAutocomplete
      v-if="isBelgiumOrEmpty && !huisnummerIsFreeText && !freeText"
      id="busnummer"
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
      id="busnummer"
      v-model="modelValueComputed"
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
import { computed } from 'vue';
import OeAutocomplete from '@components/dumb/OeAutocomplete.vue';
import type { IAutocompleteOption } from '@models/autocomplete';
import type { IAdres } from '@models/locatie';

interface BusnummerSelectorProps {
  modelValue: string | IAdres | undefined;
  disabled: boolean;
  freeText: boolean;
  modError: boolean;
  autocompleteFn?: (term: string) => Promise<IAutocompleteOption[]>;
  isBelgiumOrEmpty: boolean;
  huisnummerIsFreeText: boolean;
}

const props = withDefaults(defineProps<BusnummerSelectorProps>(), {
  modelValue: undefined,
  disabled: false,
  freeText: false,
  modError: false,
  autocompleteFn: undefined,
  isBelgiumOrEmpty: true,
  huisnummerIsFreeText: false,
});
const emit = defineEmits(['update:modelValue']);

const modelValueComputed = computed({
  get: () => (typeof props.modelValue === 'string' ? props.modelValue : (props.modelValue as IAdres)?.busnummer || ''),
  set: (val: string) => emit('update:modelValue', val),
});

const autocompleteOption = computed(() => ({
  title: typeof props.modelValue !== 'string' ? (props.modelValue as IAdres)?.busnummer : props.modelValue,
  value: props.modelValue,
}));

const autocompleteFn = (term: string) => props.autocompleteFn?.(term) ?? Promise.resolve([]);
const onUpdate = (opt: IAutocompleteOption) => emit('update:modelValue', opt?.value);
</script>
