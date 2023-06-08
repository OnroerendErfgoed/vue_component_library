<template>
  <div class="vl-grid filters-input">
    <vl-select v-model:value="selectedOption" class="vl-col--5-12" mod-block mod-inline>
      <option v-for="option in options" :key="option.key" :value="option">
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
        id="datepicker-01"
        v-model="dateFilter"
      />
      <div v-else-if="selectedOption.type === FilterOptionType.RADIO" class="radio-select">
        <vl-radio id="radio-01" v-model="choiceDefault" name="radio-name-01" value="ja" @click="radioClicked"
          >Ja</vl-radio
        >
        <vl-radio id="radio-02" v-model="choiceDefault" name="radio-name-01" value="nee" @click="radioClicked"
          >Nee</vl-radio
        >
      </div>
      <!-- <vl-select v-else-if="selectedOption.type === FilterOptionType.SELECT" mod-block placeholder="fw"></vl-select>
      <VlMultiselect
        v-else-if="selectedOption.type === FilterOptionType.MULTISELECT"
        v-model="gemeente"
        :placeholder="selectedOption.label"
        :custom-label="customGemeenteLabel"
        :mod-multiple="false"
        :options="gemeenten"
        :preserve-search="true"
      >
        <template #noResult>
          <span>Geen resultaten gevonden...</span>
        </template>
        <template #noOptions>
          <span>Geen opties beschikbaar</span>
        </template>
      </VlMultiselect> -->
      <vl-input-addon
        tag-name="button"
        type="button"
        icon="plus"
        tooltip="Filter toevoegen"
        text="Filter toevoegen"
        @click="addFilter"
      />
    </vl-input-group>
  </div>
  <div class="vl-grid filters-selected">
    <span class="vl-col--1-12">Filters:</span>
    <vl-action-group class="vl-col--11-12">
      <vl-pill
        v-for="filter in filters"
        :key="filter.key"
        mod-clickable
        mod-closable
        class="vl-u-spacer-left--xsmall vl-u-spacer-bottom--xsmall"
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
import { FilterOptionType, type IFilter, type IFilterOption } from '@models/filter-input';
import { ref } from 'vue';

const textFilter = ref('');
const dateFilter = ref('');

const filters = ref<IFilter[]>([]);
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
      filter.value = { label: dateFilter.value, value: dateFilter.value };
      break;
  }

  if (
    !filters.value.find((f) => f.key === filter.key && f.value.value === filter.value.value) &&
    (!!filter.value.value || typeof filter.value.value === 'boolean')
  ) {
    filters.value.push(filter);
    clearInputs();
  }

  console.log(filters.value);
};

const clearInputs = () => {
  textFilter.value = '';
};

// Options
const options: IFilterOption[] = [
  {
    label: 'ID',
    key: 'id',
    type: FilterOptionType.TEXT,
  },
  {
    label: 'Type plan',
    key: 'plantype',
    type: FilterOptionType.SELECT,
  },
  // {
  //   label: 'Onderwerp',
  //   key: 'onderwerp',
  //   type: FilterOptionType.TEXT,
  // },
  {
    label: 'Gemeente',
    key: 'gemeente',
    type: FilterOptionType.MULTISELECT,
  },
  // {
  //   label: 'Provincie',
  //   key: 'provincie',
  //   type: FilterOptionType.PROVINCIE,
  // },
  {
    label: 'Datum goedkeuring vanaf',
    key: 'datum_goedkeuring_van',
    type: FilterOptionType.DATE,
  },
  // {
  //   label: 'Datum goedkeuring tot',
  //   key: 'datum_goedkeuring_tot',
  //   type: FilterOptionType.DATE,
  // },
  // {
  //   label: 'Beheersplan verlopen',
  //   key: 'beheersplan_verlopen',
  //   type: FilterOptionType.RADIO,
  // },
  {
    label: 'Beheerscommissie',
    key: 'beheerscommissie',
    type: FilterOptionType.RADIO,
  },
  // {
  //   label: 'Aanduidingsobject',
  //   key: 'aanduidingsobject',
  //   type: FilterOptionType.AANDUIDINGSOBJECT,
  // },
  // {
  //   label: 'Status',
  //   key: 'status',
  //   type: FilterOptionType.PLAN_STATUS,
  // },
];
const selectedOption = ref<IFilterOption>(options[0]);

// Gemeenten
// const crabService = new CrabService(props.api);
// const customGemeenteLabel = (option: IGemeente) => option.naam;
// const gemeenten = ref<IGemeente[]>([]);
// const gemeente = ref<IGemeente>();

// watch(selectedOption, async (newValue) => {
//   if (newValue.key === 'gemeente') {
//     gemeenten.value = await crabService.getGemeenten();
//   }
// });
</script>

<style lang="scss" scoped>
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
