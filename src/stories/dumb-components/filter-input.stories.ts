import type { Meta, StoryObj } from '@storybook/vue3';
import FilterDatepicker from '../../components/dumb/FilterDatepicker.vue';
import FilterInput from '../../components/dumb/FilterInput.vue';
import FilterRadio from '../../components/dumb/FilterRadio.vue';
import FilterSelect from '../../components/dumb/FilterSelect.vue';
import FilterText from '../../components/dumb/FilterText.vue';
import FilterGemeente from '../../components/smart/FilterGemeente.vue';

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
      description: {
        component:
          'Generic filter input component that accepts any filter input field as long as the slot props are correctly used.\n\n See the `Filter Inputs` folder (both in `smart` and `dumb` components) for example components to be used. A subset is used in the example below.',
      },
    },
  },
  argTypes: {
    default: {
      description:
        'Default slot that exposes a couple of props to hook into. This way, custom filter field components can work with this input-filter component',
      table: {
        type: {
          summary: 'Exposed props',
          detail: `
value: current filter field value
selectedOption: selected option from provided options list, can be used to determine which custom filter field to show
setValue: function to apply the entered filter value from the custom filter field to the filter input component`,
        },
      },
    },
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
      FilterText,
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
    <filter-input v-slot="{ value, setValue, selectedOption }" :options="filterOptions" @filters-selected="$event => filters = $event">
      <filter-text v-if="selectedOption.key === 'id'" :value="value" @update:value="setValue($event, $event)" placeholder="ID"></filter-text>
      <filter-text v-if="selectedOption.key === 'onderwerp'" :value="value" @update:value="setValue($event, $event)" placeholder="Onderwerp"></filter-text>
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
