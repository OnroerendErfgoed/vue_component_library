import type { Meta, StoryObj } from '@storybook/vue3';
import FilterDatepicker from '../../components/dumb/FilterDatepicker.vue';
import FilterGemeente from '../../components/dumb/FilterGemeente.vue';
import FilterInput from '../../components/dumb/FilterInput.vue';
import FilterInputField from '../../components/dumb/FilterInputField.vue';
import FilterRadio from '../../components/dumb/FilterRadio.vue';
import FilterSelect from '../../components/dumb/FilterSelect.vue';

import '@/scss/main.scss';
import { type IFilterOption, type IOption } from '../../models/filter-input';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof FilterInput> = {
  title: 'Dumb components/FilterInput',
  component: FilterInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        height: '400px',
      },
    },
  },
  argTypes: {
    options: {
      description: 'List of filter options to populate the select input',
      table: {
        type: { summary: 'IFilterOption[]' },
      },
    },
    'filters-selected': {
      description: 'Emits the currently active filters on each filter change',
      table: {
        type: { summary: 'IFilter[]' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterInput>;

export const Default: Story = {
  render: () => ({
    components: {
      FilterInput,
      FilterInputField,
      FilterDatepicker,
      FilterGemeente,
      FilterRadio,
      FilterSelect,
    },
    setup() {
      const filterOptions: IFilterOption[] = [
        {
          label: 'ID',
          key: 'id',
        },
        {
          label: 'Type plan',
          key: 'plantype',
        },
        {
          label: 'Onderwerp',
          key: 'onderwerp',
        },
        {
          label: 'Gemeente',
          key: 'gemeente',
        },
        {
          label: 'Datum goedkeuring vanaf',
          key: 'datum_goedkeuring_van',
        },
        {
          label: 'Datum goedkeuring tot',
          key: 'datum_goedkeuring_tot',
        },
        {
          label: 'Beheersplan verlopen',
          key: 'beheersplan_verlopen',
        },
        {
          label: 'Beheerscommissie',
          key: 'beheerscommissie',
        },
        {
          label: 'Status',
          key: 'status',
        },
      ];
      const statusOptions: IOption[] = [
        {
          label: 'Klad',
          value: 'klad',
        },
        {
          label: 'Actief',
          value: 'actief',
        },
      ];
      const radioOptions: IOption[] = [
        {
          label: 'Ja',
          value: 'ja',
        },
        {
          label: 'Nee',
          value: 'nee',
        },
      ];

      return { filterOptions, statusOptions, radioOptions };
    },
    template: `
    <filter-input v-slot="{ value, setValue, selectedOption }" :options="filterOptions" @filters-selected="filters = $event">
      <filter-input-field v-if="selectedOption.key === 'id'" :value="value" @update:value="setValue($event, $event)" placeholder="ID"></filter-input-field>
      <filter-input-field v-if="selectedOption.key === 'onderwerp'" :value="value" @update:value="setValue($event, $event)" placeholder="Onderwerp"></filter-input-field>
      <filter-datepicker v-if="selectedOption.key === 'datum_goedkeuring_van' || selectedOption.key === 'datum_goedkeuring_tot'" :value="value" @update:value="setValue($event, $event[0])"></filter-datepicker>
      <filter-gemeente v-if="selectedOption.key === 'gemeente'" :value="value" @update:value="setValue($event, $event.naam)"></filter-gemeente>
      <filter-radio v-if="selectedOption.key === 'beheerscommissie' || selectedOption.key === 'beheersplan_verlopen'" :options="radioOptions" :value="value" @update:value="setValue($event, $event)"></filter-radio>
      <filter-select v-if="selectedOption.key === 'plantype'" placeholder="Type plan" :value="value" @update:value="setValue($event, $event)">
        <optgroup label="Niet Actief">
          <option value="klad">Klad</option>
          <option value="kladzonderfoto">Klad zonder foto</option>
        </optgroup>
        <optgroup label="Actief">
          <option value="actief">Actief</option>
        </optgroup>
      </filter-select>
      <filter-select v-if="selectedOption.key === 'status'" :options="statusOptions" placeholder="Status" :value="value" @update:value="setValue($event, $event)"></filter-select>
    </filter-input>
    `,
  }),
};
