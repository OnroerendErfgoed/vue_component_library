import OeGrid from '@components/dumb/OeGrid.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import '@/scss/main.scss';
import type { FirstDataRenderedEvent } from 'ag-grid-community';

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
      source: {
        component: 'f',
      },
      canvas: {
        component: 'f',
      },
    },
  },
  argTypes: {
    gridOptions: {
      control: 'object',
      description:
        'Grid options automatically passed to the ag-grid instance - see https://www.ag-grid.com/vue-data-grid/grid-options/ for more info',
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeGrid>;

export const Default: Story = {
  render: (args) => ({
    components: { OeGrid },
    setup() {
      const firstDataRendered = (grid: FirstDataRenderedEvent) => {
        grid.api.sizeColumnsToFit();
      };
      return { args, firstDataRendered };
    },
    template: `<oe-grid style="width: 100%; height: 300px" @first-data-rendered="firstDataRendered" />`,
  }),
  args: {
    gridOptions: {
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
    },
  },
};
