import { VlMultiselect, VlSelect } from '@govflanders/vl-ui-design-system-vue3';
import type { Meta, StoryObj } from '@storybook/vue3';
import FilterInput from '../../components/dumb/FilterInput.vue';

import '@/scss/main.scss';
import { onBeforeMount, ref } from 'vue';
import { FilterOptionType, type IFilterOption } from '../../models/filter-input';
import type { IGemeente } from '../../models/locatie';
import { CrabService } from '../../services/crab.api-service';

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
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  render: () => ({
    components: {
      FilterInput,
      VlSelect,
      VlMultiselect,
    },
    setup() {
      const filterOptions: IFilterOption[] = [
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
        {
          label: 'Onderwerp',
          key: 'onderwerp',
          type: FilterOptionType.TEXT,
        },
        {
          label: 'Gemeente',
          key: 'gemeente',
          type: FilterOptionType.MULTISELECT,
        },
        {
          label: 'Datum goedkeuring vanaf',
          key: 'datum_goedkeuring_van',
          type: FilterOptionType.DATE,
        },
        {
          label: 'Datum goedkeuring tot',
          key: 'datum_goedkeuring_tot',
          type: FilterOptionType.DATE,
        },
        {
          label: 'Beheersplan verlopen',
          key: 'beheersplan_verlopen',
          type: FilterOptionType.RADIO,
        },
        {
          label: 'Beheerscommissie',
          key: 'beheerscommissie',
          type: FilterOptionType.RADIO,
        },
        {
          label: 'Status',
          key: 'status',
          type: FilterOptionType.SELECT,
        },
      ];

      // Gemeenten
      const crabService = new CrabService('https://dev-geo.onroerenderfgoed.be/');
      const gemeenten = ref<IGemeente[]>([]);
      const customGemeenteLabel = (option: IGemeente) => option.naam;

      onBeforeMount(async () => {
        gemeenten.value = await crabService.getGemeenten();
      });

      return { filterOptions, customGemeenteLabel, gemeenten };
    },
    template: `
    <filter-input :options="filterOptions" @filters-selected="filters = $event">
      <template v-slot:select-filter="{ value, setValue, selectedOption }">
        <vl-select
          v-if="selectedOption.key === 'status'"
          placeholder-text="Status"
          mod-block
          :value="value"
          @update:value="setValue"
        >
          <optgroup label="Niet Actief">
            <option value="klad">Klad</option>
            <option value="kladzonderfoto">Klad zonder foto</option>
          </optgroup>
          <optgroup label="Actief">
            <option value="actief">Actief</option>
          </optgroup>
        </vl-select>

        <vl-select
          v-if="selectedOption.key === 'plantype'"
          placeholder-text="Type plan"
          mod-block
          :value="value"
          @update:value="setValue"
        >
          <option>Geïntegreerd Beheersplan</option>
          <option>Onroerend Erfgoed Beheersplan</option>
          <option>Onroerenderfgoedrichtplan</option>
        </vl-select>
      </template>

      <template v-slot:multiselect-filter="{ value, setValue, selectedOption }">
        <vl-multiselect
          v-if="selectedOption.key === 'gemeente'"
          placeholder="Gemeente"
          :custom-label="customGemeenteLabel"
          :mod-multiple="false"
          :options="gemeenten"
          :preserve-search="true"
          :value="value?.value"
          @update:value="setValue($event, $event.naam)"
          @keydown.tab="!value ? $event.preventDefault() : null"
        >
          <template #noResult>
            <span>Geen resultaten gevonden...</span>
          </template>
          <template #noOptions>
            <span>Geen opties beschikbaar</span>
          </template></vl-multiselect
        >
      </template>
    </filter-input>
    `,
  }),
};
