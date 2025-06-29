<template>
  <div class="filter-input-component vl-u-flex vl-u-flex-direction-column">
    <div class="vl-grid filters-input">
      <span v-if="!props?.options.length" data-cy="no-options" class="vl-alert--warning"
        >Geen filteropties geconfigureerd</span
      >
      <template v-else>
        <vl-select
          v-model="selectedOption"
          data-cy="filter-select"
          class="vl-col--5-12"
          mod-block
          mod-inline
          @update:model-value="clearInputs"
        >
          <option v-for="option in props.options" :key="option.key" :value="option">
            {{ option.label }}
          </option>
        </vl-select>
        <vl-input-group class="vl-col--7-12">
          <slot
            :value="filterInputValue?.value"
            :set-value="setFilterInputValue"
            :selected-option="selectedOption"
            :add-filter="addFilter"
          ></slot>

          <vl-input-addon
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
        </vl-input-group>
      </template>
    </div>
    <div v-if="!!filters.length" class="vl-grid filters-selected">
      <vl-action-group class="vl-col--12-12">
        <button
          data-cy="clear-filter-button"
          class="vl-button vl-u-spacer-left--xsmall vl-u-spacer-bottom--xsmall vl-u-text--small"
          @click="filters = []"
        >
          Alle filters wissen
        </button>
        <vl-pill
          v-for="filter in filters"
          :key="filter.key"
          :data-cy="`filter-${filter.key}-${filter.value.value}`"
          mod-closable
          class="vl-u-spacer-left--xsmall vl-u-spacer-bottom--xsmall"
          @close="removeFilter(filter)"
        >
          {{ filter.label }} / {{ filter.value.label }}
        </vl-pill>
      </vl-action-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VlActionGroup, VlInputAddon, VlInputGroup, VlPill, VlSelect } from '@govflanders/vl-ui-design-system-vue3';
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

.vl-grid {
  &.filters-input {
    width: 100%;
    margin-left: 0;
    align-self: flex-end;

    .vl-input-group {
      padding-left: 0.5rem;
    }
  }

  &.filters-selected {
    margin-top: 2rem;
    align-self: flex-end;

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
