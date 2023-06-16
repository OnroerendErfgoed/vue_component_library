<template>
  <div class="vl-grid filters-input">
    <span v-if="!props?.options.length" data-cy="no-options" class="vl-alert--warning"
      >Geen filteropties geconfigureerd</span
    >
    <template v-else>
      <vl-select
        v-model:value="selectedOption"
        data-cy="filter-select"
        class="vl-col--5-12"
        mod-block
        mod-inline
        @update:value="clearInputs"
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
    <span data-cy="filters-label" class="vl-col--1-12">Filters:</span>
    <vl-action-group class="vl-col--10-12">
      <vl-pill
        data-cy="clear-filter-button"
        class="vl-u-spacer-left--xsmall vl-u-spacer-bottom--xsmall"
        mod-clickable
        @click="filters = []"
        >Alle filters wissen</vl-pill
      >
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
</template>

<script setup lang="ts">
import { VlInputGroup, VlInputAddon, VlActionGroup, VlSelect, VlPill } from '@govflanders/vl-ui-design-system-vue3';
import type { TFilterInput, IFilter, IFilterInputProps, IFilterOption } from '@models/filter-input';
import { isEmpty, remove } from 'lodash';
import { computed, ref, watch } from 'vue';

const props = withDefaults(defineProps<IFilterInputProps>(), {
  options: () => [],
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
const filters = ref<IFilter[]>([]);
watch(
  filters,
  () => {
    emit('filters-selected', filters.value);
  },
  { deep: true }
);

// Filter helper methods
const addFilter = () => {
  const filter: IFilter = {
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
    filters.value.push(filter);
    clearInputs();
  }
};
const removeFilter = (filter: IFilter) =>
  remove(filters.value, (f) => f.key === filter.key && filter.value.value === f.value.value);
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/pyoes-settings';

.vl-grid {
  &.filters-input {
    margin: 1rem 0.5rem;
  }

  &.filters-selected {
    margin: 2rem -2.5rem;

    :deep(.vl-action-group button:last-child) {
      margin-right: -1px;
    }

    .vl-pill {
      cursor: pointer;
      margin-right: 0.5rem;
    }
  }
}
</style>
