<template>
  <div :id="`autocomplete-${props.id}`" v-click-outside="hideResults" data-cy="autocomplete" class="js-vl-autocomplete">
    <vl-input-field
      v-bind="attrs"
      v-model="searchTerm"
      data-cy="autocomplete-input"
      :placeholder="props.placeholder"
      mod-block
      @update:model-value="handleInput"
    ></vl-input-field>
    <span v-if="loading" class="vl-loader vl-loader--small" data-cy="loader"></span>

    <div v-if="showResults && searchTerm?.length >= minChars" class="vl-autocomplete" data-cy="result">
      <div class="vl-autocomplete__list-wrapper">
        <div class="vl-autocomplete__list">
          <template v-if="loading">
            <li class="vl-autocomplete__cta" data-cy="loader-message">
              <span class="vl-autocomplete__cta__title">Resultaten worden opgehaald...</span>
            </li>
          </template>
          <li
            v-for="option in options"
            v-else
            :key="option.value as string"
            tabindex="0"
            class="vl-autocomplete__cta"
            @keyup.enter="selectResult(option)"
            @click="selectResult(option)"
          >
            <span class="vl-autocomplete__cta__title">{{ option.title }}</span>
            <span v-if="option.subtitle" class="vl-autocomplete__cta__sub">{{ option.subtitle }}</span>
          </li>
          <li
            v-if="!props.allowFreeText && options.length === 0 && !loading"
            class="vl-autocomplete__cta"
            data-cy="no-results"
          >
            <span class="vl-autocomplete__cta__title">Geen resultaten gevonden</span>
            <span class="vl-autocomplete__cta__sub">Doe een nieuwe zoekopdracht</span>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VlInputField } from '@govflanders/vl-ui-design-system-vue3';
import { computed, ref, useAttrs, watch } from 'vue';
import { vClickOutside } from '@directives/click-outside.directive';
import type { IAutocompleteOption, IAutocompleteProps } from '@models/autocomplete';

const attrs = useAttrs();
const props = withDefaults(defineProps<IAutocompleteProps>(), {
  value: undefined,
  id: 'id',
  autoselect: false,
  minChars: 3,
  placeholder: 'Type om te zoeken...',
  callbackFn: (searchTerm: string) => Promise.resolve([{ title: searchTerm }]),
  allowFreeText: false,
});
const emit = defineEmits(['update:value']);

const selectedOption = ref<IAutocompleteOption>();
const searchTerm = ref('');
const loading = ref(false);
const options = ref<IAutocompleteOption[]>([]);
const showResults = ref(false);

const minChars = computed(() => (isNaN(parseInt(searchTerm.value, 10)) ? props.minChars : 1));

const handleInput = (value: string) => {
  if (!value) {
    showResults.value = false;
    selectedOption.value = { title: '', value: '' };
    emit('update:value', selectedOption.value);
  } else {
    searchTerm.value = value;
    showResults.value = true;
  }
};

const selectResult = (result: IAutocompleteOption) => {
  selectedOption.value = result;
  searchTerm.value = result.title;
  showResults.value = false;
  emit('update:value', result);
};

const hideResults = () => (showResults.value = false);

const fetchData = async (searchTerm: string) => {
  if (typeof props.callbackFn === 'function') {
    return await props.callbackFn(searchTerm);
  } else {
    console.error('[OE Autocomplete] fetchCallback is not a function');
    return Promise.resolve([]);
  }
};

watch(searchTerm, async (newValue, previousValue) => {
  if (searchTerm.value?.length >= minChars.value) {
    loading.value = true;
    const data = await fetchData(searchTerm.value);
    options.value = data;

    if (props.autoselect && newValue.length > previousValue.length && data.length === 1) {
      selectResult(data[0]);
    }
    loading.value = false;

    if (options.value.length === 0 && props.allowFreeText && searchTerm.value !== props.value?.title) {
      showResults.value = false;
      selectResult({ title: searchTerm.value, value: searchTerm.value });
    }
  }
});

watch(
  () => props.value,
  () => {
    searchTerm.value = props.value?.title || '';
    if (selectedOption.value && !props.value?.value) {
      selectedOption.value = undefined;
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables';

.js-vl-autocomplete {
  width: 100%;

  :deep(.vl-loader) {
    position: absolute;
    right: 10px;
    top: 9px;
    z-index: 100;
  }

  .vl-autocomplete {
    .vl-autocomplete__cta {
      cursor: pointer;

      &:hover,
      &:focus {
        background: rgba($primary-color, 0.1);
      }
    }
  }
}

.vl-input-field--disabled {
  opacity: 0.6;
}
</style>
