<template>
  <div class="vl-grid filters-input">
    <span v-if="!props.options.length" class="vl-alert--warning">Geen filteropties geconfigureerd</span>
    <template v-else>
      <vl-select v-model:value="selectedOption" class="vl-col--5-12" mod-block mod-inline @change="clearInputs">
        <option v-for="option in props.options" :key="option.key" :value="option">
          {{ option.label }}
        </option>
      </vl-select>
      <vl-input-group class="vl-col--7-12">
        <vl-input-field
          v-if="selectedOption.type === FilterOptionType.TEXT"
          v-model="textFilter"
          mod-block
          :placeholder="selectedOption.label"
        >
        </vl-input-field>
        <vl-datepicker
          v-else-if="selectedOption.type === FilterOptionType.DATE"
          id="datepicker"
          :value="dateFilter"
          visual-format="d-m-Y"
          @input="($event: Event) => dateChange($event)"
        />
        <div v-else-if="selectedOption.type === FilterOptionType.RADIO" class="radio-select">
          <vl-radio id="radio-ja" v-model="radioFilter" name="radio-filter" value="Ja">Ja</vl-radio>
          <vl-radio id="radio-nee" v-model="radioFilter" name="radio-filter" value="Nee">Nee</vl-radio>
        </div>

        <slot
          v-else-if="selectedOption.type === FilterOptionType.SELECT"
          name="select-filter"
          :value="selectFilter"
          :set-value="setSelectValue"
          :selected-option="selectedOption"
        >
        </slot>

        <slot
          v-else-if="selectedOption.type === FilterOptionType.MULTISELECT"
          name="multiselect-filter"
          :value="multiselectFilter"
          :set-value="setMultiselectValue"
          :selected-option="selectedOption"
        ></slot>

        <vl-input-addon
          :mod-disabled="filterValuesEmpty"
          :disabled="filterValuesEmpty"
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
    <span class="vl-col--1-12">Filters:</span>
    <vl-action-group class="vl-col--10-12">
      <vl-pill class="vl-u-spacer-left--xsmall vl-u-spacer-bottom--xsmall" mod-clickable @click="filters = []"
        >Alle filters wissen</vl-pill
      >
      <vl-pill
        v-for="filter in filters"
        :key="filter.key"
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
import {
  VlInputField,
  VlInputGroup,
  VlInputAddon,
  VlDatepicker,
  VlActionGroup,
  VlRadio,
  VlSelect,
  VlPill,
} from '@govflanders/vl-ui-design-system-vue3';
import { FilterOptionType, type IFilter, type IFilterInputProps, type IFilterOption } from '@models/filter-input';
import { isEmpty, remove } from 'lodash';
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<IFilterInputProps>(), {
  api: '',
  options: () => [],
});
const emit = defineEmits<{
  (e: 'filters-selected', filters: IFilter[]): void;
}>();

const textFilter = ref('');
const dateFilter = ref<string[]>([]);
const radioFilter = ref('');

// select filter
const selectFilter = ref('');
const setSelectValue = (value: string) => (selectFilter.value = value);

// multiselect filter
const multiselectFilter = ref<{ label?: string; value?: unknown }>();
const setMultiselectValue = (value: unknown, label: string) => (multiselectFilter.value = { value, label });

const filters = ref<IFilter[]>([]);
const filterValuesEmpty = computed(() => {
  return (
    isEmpty(textFilter.value) &&
    isEmpty(dateFilter.value) &&
    isEmpty(radioFilter.value) &&
    isEmpty(selectFilter.value) &&
    isEmpty(multiselectFilter.value)
  );
});
const addFilter = () => {
  const filter: IFilter = {
    key: selectedOption.value.key,
    label: selectedOption.value.label,
    value: {
      label: '',
      value: '',
    },
  };

  switch (selectedOption.value.type) {
    case FilterOptionType.TEXT:
      filter.value = { label: textFilter.value, value: textFilter.value };
      break;
    case FilterOptionType.DATE:
      filter.value = { label: dateFilter.value[0], value: dateFilter.value[0] };
      break;
    case FilterOptionType.RADIO:
      filter.value = { label: radioFilter.value, value: radioFilter.value };
      break;
    case FilterOptionType.SELECT:
      filter.value = { label: selectFilter.value, value: selectFilter.value };
      break;
    case FilterOptionType.MULTISELECT:
      filter.value = {
        label: multiselectFilter.value?.label as string,
        value: multiselectFilter.value?.value as unknown,
      };
  }

  if (
    !filters.value.find((f) => f.key === filter.key && f.value.value === filter.value.value) &&
    (!!filter.value.value || typeof filter.value.value === 'boolean')
  ) {
    filters.value.push(filter);
    clearInputs();
  }

  emit('filters-selected', filters.value);
};
const removeFilter = (filter: IFilter) =>
  remove(filters.value, (f) => f.key === filter.key && filter.value.value === f.value.value);

const dateChange = (event: Event) => {
  const dateValue = (event.target as HTMLInputElement)?.value;
  if (dateValue) {
    dateFilter.value = [dateValue];
  }
};

const clearInputs = () => {
  textFilter.value = '';
  dateFilter.value = [];
  radioFilter.value = '';
  selectFilter.value = '';
  multiselectFilter.value = {};
};

const selectedOption = ref<IFilterOption>(props.options[0]);
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/pyoes-settings';

.vl-grid {
  &.filters-input {
    margin: 1rem 0.5rem;

    .vl-datepicker {
      width: 100%;
    }

    .radio-select {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }

    :deep(.vl-multiselect) {
      width: 100%;
    }
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

.vl-multiselect {
  flex: 1;

  :deep(.multiselect__tags) {
    padding-top: 0;
    display: flex;
    align-items: center;

    .multiselect__single {
      margin-bottom: 0;
      padding-top: 0;
    }
  }
}
</style>
