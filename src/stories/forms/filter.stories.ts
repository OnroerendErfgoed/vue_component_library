import { VlButton, VlColumn, VlGrid } from '@govflanders/vl-ui-design-system-vue3';
import OeFilter from '@components/forms/dumb/OeFilter.vue';
import OeFilterDatepicker from '@components/forms/dumb/OeFilterDatepicker.vue';
import OeFilterRadio from '@components/forms/dumb/OeFilterRadio.vue';
import OeFilterSelect from '@components/forms/dumb/OeFilterSelect.vue';
import OeFilterText from '@components/forms/dumb/OeFilterText.vue';
import { IFilter, IFilterOption, IOption } from '@components/forms/models/filter';
import OeFilterAanduidingsobject from '@components/forms/smart/OeFilterAanduidingsobject.vue';
import OeFilterGemeente from '@components/forms/smart/OeFilterGemeente.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeFilter> = {
  title: 'Forms Module/Filter',
  component: OeFilter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        height: '400px',
      },
      description: {
        component:
          'Generic filter component that accepts any filter input field as long as the slot props are correctly used.\n\n See the `Filter Inputs` folder (both in `smart` and `dumb` components) for example components to be used. A subset is used in the example below.',
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
    defaultFilters: {
      description: 'List of default filters',
      table: {
        type: { summary: 'IFilter[]' },
      },
    },
    uniqueFilters: {
      description: 'When true, only one filter per key is allowed, replacing existing filters with the same key',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
type Story = StoryObj<typeof OeFilter>;

const renderConfig = {
  components: {
    OeFilter,
    OeFilterText,
    OeFilterDatepicker,
    OeFilterGemeente,
    OeFilterRadio,
    OeFilterSelect,
    OeFilterAanduidingsobject,
    VlGrid,
    VlColumn,
    VlButton,
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
      {
        label: 'Aanduidingsobject',
        key: 'aanduidingsobject',
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
    const defaultFilters = [
      {
        key: 'test1',
        label: 'test2',
        value: {
          label: 'test3',
          value: 'test4',
        },
      },
    ];
    const manyDefaultFilters = Array.from({ length: 10 }, (_, i) => ({
      key: `test${i + 1}`,
      label: `test${i + 2}`,
      value: {
        label: `test${i + 3}`,
        value: `test${i + 4}`,
      },
    }));

    return { filterOptions, statusOptions, radioOptions, defaultFilters, manyDefaultFilters };
  },
};

const filterTemplate = `
  <OeFilterText v-if="selectedOption.key === 'id'" :value="value" @update:value="setValue($event, $event)" placeholder="ID" @keyup.enter="addFilter"></OeFilterText>
  <OeFilterText v-if="selectedOption.key === 'onderwerp'" :value="value" @update:value="setValue($event, $event)" placeholder="Onderwerp" @keyup.enter="addFilter"></OeFilterText>
  <OeFilterDatepicker v-if="selectedOption.key === 'datum_goedkeuring_van' || selectedOption.key === 'datum_goedkeuring_tot'" :value="value" @update:value="setValue($event, $event[0])"></OeFilterDatepicker>
  <OeFilterGemeente v-if="selectedOption.key === 'gemeente'" api="https://test-geo.onroerenderfgoed.be/" :value="value" @update:value="setValue($event.niscode, $event.naam)"></OeFilterGemeente>
  <OeFilterRadio v-if="selectedOption.key === 'beheerscommissie' || selectedOption.key === 'beheersplan_verlopen'" :options="radioOptions" :value="value" @update:value="setValue($event.value, $event.label)"></OeFilterRadio>
  <OeFilterSelect v-if="selectedOption.key === 'plantype'" placeholder="Type plan" :value="value" @update:value="setValue($event, $event)" @keyup.enter="addFilter">
    <optgroup label="Niet Actief">
      <option value="klad">Klad</option>
      <option value="kladzonderfoto">Klad zonder foto</option>
    </optgroup>
    <optgroup label="Actief">
      <option value="actief">Actief</option>
    </optgroup>
  </OeFilterSelect>
  <OeFilterSelect v-if="selectedOption.key === 'status'" :options="statusOptions" placeholder="Status" :value="value" @update:value="setValue($event, $event)" @keyup.enter="addFilter"></OeFilterSelect>
  <OeFilterAanduidingsobject
      id="test"
      v-if="selectedOption.key === 'aanduidingsobject'"
      :value="value"
      api="https://dev-inventaris.onroerenderfgoed.be/"
      @update:value="setValue($event.value, $event.title)"
    ></OeFilterAanduidingsobject>
`;

export const Default: Story = {
  render: () => ({
    ...renderConfig,
    template: `
    <OeFilter v-slot="{ value, setValue, selectedOption, addFilter }" :options="filterOptions" :default-filters="defaultFilters" @filters-selected="$event => filters = $event">
      ${filterTemplate}
    </OeFilter>
    `,
  }),
};

export const UniqueFilters: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When uniqueFilters is enabled, only one filter per key is allowed. Adding a new filter with the same key will replace the existing one.',
      },
    },
  },
  render: () => ({
    ...renderConfig,
    template: `
    <OeFilter v-slot="{ value, setValue, selectedOption, addFilter }" :options="filterOptions" :default-filters="defaultFilters" unique-filters @filters-selected="$event => filters = $event">
      ${filterTemplate}
    </OeFilter>
    `,
  }),
};

export const ResponsiveDesign: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'This story showcases the responsive design of the filter input component. It resizes and adapts its layout based on the container size, ensuring usability across different screen sizes. When multiple filters are selected, they should overflow the container without affecting the filter input size. \n\nNote: a border is added to the containers to visualize their size, the filter input itself does not have a border.',
      },
    },
  },
  render: () => ({
    ...renderConfig,
    template: `
    <p>A container with a width of 100% uses 50% of the available space</p>
    <div style="width: 100%; border: 1px solid lightgrey; padding: 1rem; box-sizing: border-box;">
      <OeFilter v-slot="{ value, setValue, selectedOption, addFilter }" :options="filterOptions" :default-filters="defaultFilters" @filters-selected="$event => filters = $event">
        ${filterTemplate}
      </OeFilter>
    </div>
    <br/>
    <p>A container with a width of 600px (smaller than 800px) uses 75% of the available space for the filter input</p>
    <div style="width: 600px ; border: 1px solid lightgrey; padding: 1rem; box-sizing: border-box;">
      <OeFilter v-slot="{ value, setValue, selectedOption, addFilter }" :options="filterOptions" :default-filters="defaultFilters" @filters-selected="$event => filters = $event">
        ${filterTemplate}
      </OeFilter>
    </div>
    <br/>
    <p>A container with a width of 450px (smaller than 500px) uses 100% of the available space for the filter input</p>
    <div style="width: 450px ; border: 1px solid lightgrey; padding: 1rem; box-sizing: border-box;">
      <OeFilter v-slot="{ value, setValue, selectedOption, addFilter }" :options="filterOptions" :default-filters="defaultFilters" @filters-selected="$event => filters = $event">
        ${filterTemplate}
      </OeFilter>
    </div>
    <br>
    <p>A container with a width of 320px (smaller than 350px) uses 100% of the available space for the filter input and renders as a single column</p>
    <div style="width: 320px ; border: 1px solid lightgrey; padding: 1rem; box-sizing: border-box;">
      <OeFilter v-slot="{ value, setValue, selectedOption, addFilter }" :options="filterOptions" :default-filters="defaultFilters" @filters-selected="$event => filters = $event">
        ${filterTemplate}
      </OeFilter>
    </div>
    <br/>
    <p>A container with a width of 100% and multiple selected filters for the filter input</p>
    <div style="width: 100%; border: 1px solid lightgrey; padding: 1rem; box-sizing: border-box;">
      <OeFilter v-slot="{ value, setValue, selectedOption, addFilter }" :options="filterOptions" :default-filters="manyDefaultFilters" @filters-selected="$event => filters = $event">
        ${filterTemplate}
      </OeFilter>
    </div>
    <br/>
    <p>A container with a width of 600px and multiple selected filters</p>
    <div style="width: 600px ; border: 1px solid lightgrey; padding: 1rem; box-sizing: border-box;">
      <OeFilter v-slot="{ value, setValue, selectedOption, addFilter }" :options="filterOptions" :default-filters="manyDefaultFilters" @filters-selected="$event => filters = $event">
        ${filterTemplate}
      </OeFilter>
    </div>
    <br/>
    <p>A container with a width of 450px and multiple selected filters</p>
    <div style="width: 450px ; border: 1px solid lightgrey; padding: 1rem; box-sizing: border-box;">
      <OeFilter v-slot="{ value, setValue, selectedOption, addFilter }" :options="filterOptions" :default-filters="manyDefaultFilters" @filters-selected="$event => filters = $event">
        ${filterTemplate}
      </OeFilter>
    </div>
    <br/>
    <p>A container with a width of 320px and multiple selected filters</p>
    <div style="width: 320px ; border: 1px solid lightgrey; padding: 1rem; box-sizing: border-box;">
      <OeFilter v-slot="{ value, setValue, selectedOption, addFilter }" :options="filterOptions" :default-filters="manyDefaultFilters" @filters-selected="$event => filters = $event">
        ${filterTemplate}
      </OeFilter>
    </div>
    `,
  }),
};

export const ExposedMethods: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates the exposed methods `addFilter` and `removeFilter` that can be accessed via template refs. These methods allow programmatic control of filters from parent components.',
      },
    },
  },
  render: () => ({
    ...renderConfig,
    data() {
      return {
        filters: [] as IFilter[],
      };
    },
    template: `
    <div>
      <VlGrid>
        <VlColumn width="12">
          <h3>Programmatic Filter Control</h3>
          <p>Use the buttons below to add or remove filters programmatically using the exposed methods.</p>
        </VlColumn>
      </VlGrid>

      <VlGrid mod-stacked>
        <VlColumn width="6">
          <VlButton
            @click="$refs.filterComponent.addFilter({
              key: 'id',
              label: 'ID',
              value: { label: '12345', value: '12345' }
            })"
            mod-block
          >
            Add ID Filter (12345)
          </VlButton>
        </VlColumn>
        <VlColumn width="6">
          <VlButton
            @click="$refs.filterComponent.addFilter({
              key: 'onderwerp',
              label: 'Onderwerp',
              value: { label: 'Test Subject', value: 'Test Subject' }
            })"
            mod-block
          >
            Add Onderwerp Filter
          </VlButton>
        </VlColumn>
        <VlColumn width="6">
          <VlButton
            @click="$refs.filterComponent.addFilter({
              key: 'status',
              label: 'Status',
              value: { label: 'Actief', value: 'actief' }
            })"
            mod-block
          >
            Add Status Filter (Actief)
          </VlButton>
        </VlColumn>
        <VlColumn width="6">
          <VlButton
            @click="$refs.filterComponent.removeFilter({
              key: 'id',
              label: 'ID',
              value: { label: '12345', value: '12345' }
            })"
            mod-block
            mod-secondary
          >
            Remove ID Filter
          </VlButton>
        </VlColumn>
      </VlGrid>

      <br/>

      <OeFilter
        ref="filterComponent"
        v-slot="{ value, setValue, selectedOption, addFilter }"
        :options="filterOptions"
        @filters-selected="filters = $event"
      >
        ${filterTemplate}
      </OeFilter>

      <br/>

      <VlGrid v-if="filters.length">
        <VlColumn width="12">
          <h4>Current Filters ({{ filters.length }})</h4>
          <pre style="background: #f6f8fa; padding: 1rem; border-radius: 6px;">{{ JSON.stringify(filters, null, 2) }}</pre>
        </VlColumn>
      </VlGrid>
    </div>
    `,
  }),
};

export const ExposedMethodsWithUniqueFilters: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When `uniqueFilters` is enabled, the `addFilter` method will replace existing filters with the same key instead of adding another filter with the same key. This is useful for scenarios where only one value per filter type should be allowed.',
      },
    },
  },
  render: () => ({
    ...renderConfig,
    data() {
      return {
        filters: [] as IFilter[],
      };
    },
    template: `
    <div>
      <VlGrid>
        <VlColumn width="12">
          <h3>Unique Filters with Exposed Methods</h3>
          <p>Click the "Add Status Filter" button multiple times. Notice how it replaces the existing status filter instead of adding another filter with the same key.</p>
        </VlColumn>
      </VlGrid>

      <VlGrid mod-stacked>
        <VlColumn width="6">
          <VlButton
            @click="$refs.filterComponent.addFilter({
              key: 'status',
              label: 'Status',
              value: { label: 'Actief', value: 'actief' }
            })"
            mod-block
          >
            Add Status Filter (Actief)
          </VlButton>
        </VlColumn>
        <VlColumn width="6">
          <VlButton
            @click="$refs.filterComponent.addFilter({
              key: 'status',
              label: 'Status',
              value: { label: 'Klad', value: 'klad' }
            })"
            mod-block
          >
            Add Status Filter (Klad) - Replaces Actief
          </VlButton>
        </VlColumn>
        <VlColumn width="6">
          <VlButton
            @click="$refs.filterComponent.addFilter({
              key: 'id',
              label: 'ID',
              value: { label: '111', value: '111' }
            })"
            mod-block
          >
            Add ID Filter (111)
          </VlButton>
        </VlColumn>
        <VlColumn width="6">
          <VlButton
            @click="$refs.filterComponent.addFilter({
              key: 'id',
              label: 'ID',
              value: { label: '222', value: '222' }
            })"
            mod-block
          >
            Add ID Filter (222) - Replaces 111
          </VlButton>
        </VlColumn>
      </VlGrid>

      <br/>

      <OeFilter
        ref="filterComponent"
        v-slot="{ value, setValue, selectedOption, addFilter }"
        :options="filterOptions"
        :unique-filters="true"
        @filters-selected="filters = $event"
      >
        ${filterTemplate}
      </OeFilter>

      <br/>

      <VlGrid v-if="filters.length">
        <VlColumn width="12">
          <h4>Current Filters ({{ filters.length }})</h4>
          <pre style="background: #f6f8fa; padding: 1rem; border-radius: 6px;">{{ JSON.stringify(filters, null, 2) }}</pre>
        </VlColumn>
      </VlGrid>
    </div>
    `,
  }),
};
