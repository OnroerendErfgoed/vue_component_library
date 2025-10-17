<template>
  <div>
    <OeAutocomplete
      v-if="isBelgiumOrEmpty && !freeText"
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
      v-model="localString"
      data-cy="input-huisnummer"
      mod-block
      placeholder="Huisnummer"
      :mod-disabled="disabled"
      :mod-error="modError"
    />
    <button v-if="showToggle" data-cy="action-huisnummer-not-found" class="vl-link" @click="$emit('toggle-free-text')">
      <span v-if="!freeText">Een huisnummer invullen dat niet tussen de suggesties staat?</span>
      <span v-else>Toon lijst met suggesties</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { VlInputField } from '@govflanders/vl-ui-design-system-vue3';
import { computed, ref, watch } from 'vue';
import OeAutocomplete from '@components/dumb/OeAutocomplete.vue';
import type { IAutocompleteOption } from '@models/autocomplete';
import type { IAdres } from '@models/locatie';

interface HuisnummerSelectorProps {
  modelValue: string | IAdres;
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

const localString = ref(
  typeof props.modelValue === 'string' ? props.modelValue : (props.modelValue as IAdres)?.huisnummer || ''
);

const autocompleteOption = computed(() => ({
  title: typeof props.modelValue !== 'string' ? (props.modelValue as IAdres)?.huisnummer : props.modelValue,
  value: props.modelValue,
}));

watch(
  () => props.modelValue,
  (v) => {
    if (typeof v === 'string') localString.value = v;
    else if (v && typeof v === 'object') localString.value = (v as IAdres).huisnummer || '';
    else localString.value = '';
  }
);

watch(localString, (v) => emit('update:modelValue', v));

const autocompleteFn = (term: string) => props.autocompleteFn?.(term) ?? Promise.resolve([]);
const onUpdate = (opt: IAutocompleteOption) => emit('update:modelValue', opt?.value);
</script>
