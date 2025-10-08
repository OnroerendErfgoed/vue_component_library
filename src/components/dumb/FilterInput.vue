<template>
  <div class="filter-input-container">
    <div class="filters-input">
      <span v-if="!props?.options.length" data-cy="no-options" class="vl-alert--warning">
        Geen filteropties geconfigureerd
      </span>
      <template v-else>
        <div class="filter-select-column">
          <VlSelect
            v-model="selectedOption"
            :title="selectedOption.label"
            data-cy="filter-select"
            mod-block
            mod-inline
            @update:model-value="clearInputs"
          >
            <option v-for="option in props.options" :key="option.key" :value="option">
              {{ option.label }}
            </option>
          </VlSelect>
        </div>
        <div class="filter-value-column">
          <VlInputGroup>
            <slot
              :value="filterInputValue?.value"
              :set-value="setFilterInputValue"
              :selected-option="selectedOption"
              :add-filter="addFilter"
            ></slot>

            <VlInputAddon
              data-cy="filter-add-button"
              :mod-disabled="filterValuesAreEmpty"
              :disabled="filterValuesAreEmpty"
              tag-name="button"
              type="button"
              icon="plus"
              tooltip="Filter toevoegen"
              text="Filter toevoegen"
              @click="addFilter"
            />
          </VlInputGroup>
        </div>
      </template>
    </div>

    <div v-if="!!filters.length" class="filters-selected">
      <VlActionGroup mod-align-right>
        <VlButton
          data-cy="clear-filter-button"
          class="vl-u-spacer-left--xsmall vl-u-spacer-bottom--xsmall vl-u-text--small"
          @click="filters = []"
        >
          Alle filters wissen
        </VlButton>
        <VlPill
          v-for="filter in filters"
          :key="filter.key"
          :data-cy="`filter-${filter.key}-${filter.value.value}`"
          mod-closable
          class="vl-u-spacer-left--xsmall vl-u-spacer-bottom--xsmall"
          @close="removeFilter(filter)"
        >
          {{ filter.label }} / {{ filter.value.label }}
        </VlPill>
      </VlActionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  VlActionGroup,
  VlButton,
  VlInputAddon,
  VlInputGroup,
  VlPill,
  VlSelect,
} from '@govflanders/vl-ui-design-system-vue3';
import { isEmpty, remove } from 'lodash';
import { computed, ref, watch } from 'vue';
import type { IFilter, IFilterInputProps, IFilterOption, TFilterInput } from '@models/filter-input';

const props = withDefaults(defineProps<IFilterInputProps>(), {
  options: () => [],
  defaultFilters: () => [],
  uniqueFilters: false,
});
const emit = defineEmits<{
  (e: 'filters-selected', filters: IFilter[]): void;
}>();

// Filter option
const selectedOption = ref<IFilterOption>(props.options[0]);

// Filter input
const filterInputValue = ref<{ value?: TFilterInput; label?: string }>();
const filterValuesAreEmpty = computed(() => isEmpty(filterInputValue.value));
const setFilterInputValue = (value: TFilterInput, label: string) => (filterInputValue.value = { value, label });
const clearInputs = () => (filterInputValue.value = {});

// Filters
const filters = ref<IFilter[]>([...props.defaultFilters]);
watch(
  filters,
  () => {
    emit('filters-selected', filters.value);
  },
  { deep: true }
);

// Filter helper methods
const addFilter = () => {
  const filter = {
    key: selectedOption.value.key,
    label: selectedOption.value.label,
    value: {
      label: filterInputValue.value?.label as string,
      value: filterInputValue.value?.value,
    },
  };

  if (
    !filters.value.find((f) => f.key === filter.key && f.value.value === filter.value.value) &&
    (!!filter.value.value || typeof filter.value.value === 'boolean')
  ) {
    if (props.uniqueFilters) {
      const existingIndex = filters.value.findIndex((f) => f.key === filter.key);
      if (existingIndex >= 0) {
        filters.value.splice(existingIndex, 1, filter);
        clearInputs();
        return;
      }
    }

    filters.value.push(filter);
    clearInputs();
  }
};
const removeFilter = (filter: IFilter) =>
  remove(filters.value, (f) => f.key === filter.key && filter.value.value === f.value.value);
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables';

.filter-input-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  container-type: inline-size; /* Enable container queries */

  .filters-input {
    display: flex;
    align-items: flex-start;

    /* Default: 50% width, always aligned to the right */
    width: 50%;
    margin-left: 50%;

    .filter-select-column {
      /* Equivalent to width="5" in a 12-column grid = 42% */
      flex: 0 0 42%;
      margin-left: -0.75rem;
      margin-right: 0.75rem;

      @container (max-width: 500px) {
        flex: 1 1 100%;
        margin-left: 0;
      }
    }

    .filter-value-column {
      /* Equivalent to width="7" in a 12-column grid = 58% */
      flex: 0 0 58%;

      @container (max-width: 500px) {
        flex: 1 1 100%;
      }
    }

    /* Container-based responsive design */
    @container (max-width: 800px) {
      width: 67%;
      margin-left: 33%;
    }

    @container (max-width: 500px) {
      width: 100%;
      margin-left: 0;
    }

    /* Stack vertically when container is small */
    @container (max-width: 350px) {
      flex-direction: column;
      gap: 1rem;

      .filter-select-column,
      .filter-value-column {
        width: 100%;
        margin: 0;
      }
    }
  }

  .filters-selected {
    margin-top: 2rem;

    :deep(.vl-action-group button:last-child) {
      margin-right: -1px;
    }

    .vl-pill {
      cursor: pointer;
    }

    .vl-button {
      min-height: revert;
      padding: 0.4rem 1.4rem;
      margin-right: 0;
    }
  }
}
</style>
