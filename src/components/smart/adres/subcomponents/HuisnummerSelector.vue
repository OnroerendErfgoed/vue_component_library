<template>
  <div>
    <OeAutocomplete
      v-if="isBelgiumOrEmpty && !freeText"
      :id="$attrs.id as string"
      data-cy="autocomplete-huisnummer"
      allow-free-text
      autoselect
      :mod-error="modError"
      :min-chars="1"
      :mod-disabled="disabled"
      :value="autocompleteOption"
      :callback-fn="autocompleteFn"
      placeholder="Huisnummer"
      @update:value="onUpdate"
    />
    <VlInputField
      v-else
      :id="$attrs.id"
      v-model="modelValueComputed"
      data-cy="input-huisnummer"
      mod-block
      placeholder="Huisnummer"
      :mod-disabled="disabled"
      :mod-error="modError"
    />
    <VlButton v-if="showToggle" mod-link data-cy="action-huisnummer-not-found" @click="$emit('toggle-free-text')">
      <span v-if="!freeText">Een huisnummer invullen dat niet tussen de suggesties staat?</span>
      <span v-else>Toon lijst met suggesties</span>
    </VlButton>
  </div>
</template>

<script setup lang="ts">
import { VlButton, VlInputField } from '@govflanders/vl-ui-design-system-vue3';
import { computed } from 'vue';
import OeAutocomplete from '@components/dumb/OeAutocomplete.vue';
import type { IAutocompleteOption } from '@models/autocomplete';
import type { IAdres } from '@models/locatie';

defineOptions({
  inheritAttrs: false,
});

interface HuisnummerSelectorProps {
  modelValue: string | IAdres | undefined;
  disabled: boolean;
  freeText: boolean;
  modError: boolean;
  autocompleteFn?: (term: string) => Promise<IAutocompleteOption[]>;
  showToggle: boolean;
  isBelgiumOrEmpty: boolean;
}

const props = withDefaults(defineProps<HuisnummerSelectorProps>(), {
  modelValue: undefined,
  disabled: false,
  freeText: false,
  modError: false,
  autocompleteFn: undefined,
  showToggle: false,
  isBelgiumOrEmpty: true,
});
const emit = defineEmits(['update:modelValue', 'toggle-free-text']);

const modelValueComputed = computed<string>({
  get: () => (typeof props.modelValue === 'string' ? props.modelValue : (props.modelValue as IAdres)?.huisnummer || ''),
  set: (val: string) => emit('update:modelValue', val),
});

const autocompleteOption = computed(() => ({
  title: typeof props.modelValue !== 'string' ? (props.modelValue as IAdres)?.huisnummer : props.modelValue,
  value: props.modelValue,
}));

const autocompleteFn = (term: string) => props.autocompleteFn?.(term) ?? Promise.resolve([]);
const onUpdate = (opt: IAutocompleteOption) => emit('update:modelValue', opt?.value);
</script>
