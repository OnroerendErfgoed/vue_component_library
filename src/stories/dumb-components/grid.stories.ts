import OeGrid from '@components/dumb/OeGrid.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import '@/scss/main.scss';
import type { FirstDataRenderedEvent, GridOptions } from 'ag-grid-community';

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof OeGrid> = {
  title: 'Dumb components/Grid',
  component: OeGrid,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'This component is a wrapper around ag-grid-vue3 (https://www.ag-grid.com/vue-data-grid/).\n\n' +
          'All properties and events are automatically inherited and thus can be used.\n\n ' +
          'Below, 1 example is showed passing in the gridOptions.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeGrid>;

export const Default: Story = {
  render: () => ({
    components: { OeGrid },
    setup() {
      const gridOptions: GridOptions = {
        columnDefs: [
          { headerName: 'Make', field: 'make' },
          { headerName: 'Model', field: 'model' },
          { headerName: 'Price', field: 'price' },
        ],
        rowData: [
          { make: 'Toyota', model: 'Celica', price: 35000 },
          { make: 'Ford', model: 'Mondeo', price: 32000 },
          { make: 'Porsche', model: 'Boxster', price: 72000 },
        ],
      };
      const firstDataRendered = (grid: FirstDataRenderedEvent) => {
        grid.api.sizeColumnsToFit();
      };
      return { firstDataRendered, gridOptions };
    },
    template: `<oe-grid style="width: 100%; height: 300px" :grid-options="gridOptions" @first-data-rendered="firstDataRendered" />`,
  }),
};

export const Sortable: Story = {
  render: () => ({
    components: { OeGrid },
    setup() {
      const gridOptions: GridOptions = {
        columnDefs: [
          { headerName: 'Make', field: 'make', sortable: true },
          { headerName: 'Model', field: 'model', sortable: true },
          { headerName: 'Price', field: 'price', sortable: true },
        ],
        rowData: [
          { make: 'Toyota', model: 'Celica', price: 35000 },
          { make: 'Ford', model: 'Mondeo', price: 32000 },
          { make: 'Porsche', model: 'Boxster', price: 72000 },
        ],
      };
      const firstDataRendered = (grid: FirstDataRenderedEvent) => {
        grid.api.sizeColumnsToFit();
      };
      return { firstDataRendered, gridOptions };
    },
    template: `<oe-grid style="width: 100%; height: 300px" :grid-options="gridOptions" @first-data-rendered="firstDataRendered" />`,
  }),
};
