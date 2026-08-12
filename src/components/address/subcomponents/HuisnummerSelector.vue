<template>
  <div v-if="!readMode">
    <OeAutocomplete
      v-if="isVlaamseGemeenteOrEmpty && !freeText"
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
  </div>
  <VlPropertiesData v-else data-cy="huisnummer-value">
    {{ selectedHuisnummer || '-' }}
  </VlPropertiesData>
</template>

<script setup lang="ts">
import { VlInputField, VlPropertiesData } from '@govflanders/vl-ui-design-system-vue3';
import { computed } from 'vue';
import OeAutocomplete from '@components/forms/dumb/OeAutocomplete.vue';
import type { IAutocompleteOption } from '@components/forms/models/autocomplete';
import type { IAdres } from '@models/locatie';

defineOptions({
  inheritAttrs: false,
});

interface HuisnummerSelectorProps {
  modelValue?: string | IAdres | undefined;
  disabled?: boolean;
  freeText?: boolean;
  modError?: boolean;
  autocompleteFn?: (term: string) => Promise<IAutocompleteOption[]>;
  isVlaamseGemeenteOrEmpty?: boolean;
  readMode?: boolean;
}

const props = withDefaults(defineProps<HuisnummerSelectorProps>(), {
  modelValue: undefined,
  disabled: false,
  freeText: false,
  modError: false,
  autocompleteFn: undefined,
  isVlaamseGemeenteOrEmpty: true,
  readMode: false,
});
const emit = defineEmits(['update:modelValue']);

const modelValueComputed = computed<string>({
  get: () => (typeof props.modelValue === 'string' ? props.modelValue : (props.modelValue as IAdres)?.huisnummer || ''),
  set: (val: string) => emit('update:modelValue', val),
});

const selectedHuisnummer = computed(() =>
  typeof props.modelValue === 'string' ? props.modelValue : props.modelValue?.huisnummer
);

const autocompleteOption = computed(() => ({
  title: typeof props.modelValue !== 'string' ? (props.modelValue as IAdres)?.huisnummer : props.modelValue,
  value: props.modelValue,
}));

const autocompleteFn = (term: string) => props.autocompleteFn?.(term) ?? Promise.resolve([]);
const onUpdate = (opt: IAutocompleteOption) => emit('update:modelValue', opt?.value);
</script>
