<template>
  <div :id="`autocomplete-${props.id}`" v-click-outside="hideResults" data-cy="autocomplete" class="js-vl-autocomplete">
    <vl-input-field
      v-model="searchTerm"
      :placeholder="props.placeholder"
      mod-block
      @update:model-value="handleInput"
    ></vl-input-field>
    <span v-if="loading" class="vl-loader vl-loader--small" data-cy="loader" />

    <div v-if="showResults && searchTerm?.length >= props.minChars" class="vl-autocomplete" data-cy="result">
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
            :key="option.value"
            tabindex="0"
            class="vl-autocomplete__cta"
            @keyup.enter="selectResult(option)"
            @click="selectResult(option)"
          >
            <span class="vl-autocomplete__cta__title">{{ option.title }}</span>
            <span v-if="option.subtitle" class="vl-autocomplete__cta__sub">{{ option.subtitle }}</span>
          </li>
          <li v-if="options.length === 0 && !loading" class="vl-autocomplete__cta" data-cy="no-results">
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
import type { IAutocompleteOption, IAutocompleteProps } from '@models/autocomplete';
import { ref, watch } from 'vue';
import { vClickOutside } from '@directives/click-outside.directive';

const props = withDefaults(defineProps<IAutocompleteProps>(), {
  value: undefined,
  id: 'id',
  autoselect: false,
  minChars: 3,
  placeholder: 'Type om te zoeken...',
  callbackFn: (searchTerm: string) => Promise.resolve([{ title: searchTerm }]),
});
const emit = defineEmits(['update:value']);

const selectedOption = ref<IAutocompleteOption>();
const searchTerm = ref('');
const loading = ref(false);
const options = ref<IAutocompleteOption[]>([]);
const showResults = ref(false);

const handleInput = (value: string) => {
  searchTerm.value = value;
  showResults.value = true;
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

watch(searchTerm, async () => {
  if (searchTerm.value?.length >= props.minChars && !selectedOption.value) {
    loading.value = true;
    const data = await fetchData(searchTerm.value);
    options.value = data;
    if (props.autoselect && data.length === 1) {
      selectResult(data[0]);
    }
    loading.value = false;
  }
});

watch(
  () => props.value,
  () => {
    if (selectedOption.value && !props.value?.value) {
      searchTerm.value = '';
      selectedOption.value = undefined;
    } else if (props.value?.title) {
      searchTerm.value = props.value?.title;
    }
  }
);
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/pyoes-settings';
@import '@govflanders/vl-ui-core/src/scss/core';
@import '@govflanders/vl-ui-autocomplete/src/scss/autocomplete';

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
</style>
