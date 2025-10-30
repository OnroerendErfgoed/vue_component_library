import '@/scss/main.scss';
import OeGrid from '@components/dumb/OeGrid.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
// Modular type imports
import type {
  FirstDataRenderedEvent,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IDatasource,
  IGetRowsParams,
} from 'ag-grid-community';

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
          'Some examples in the specified stories, not all functionality is covered in these stories, consult the ag-grid docs for more info.',
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

export const DefaultNoData: Story = {
  render: () => ({
    components: { OeGrid },
    setup() {
      const gridOptions: GridOptions = {
        columnDefs: [
          { headerName: 'Make', field: 'make' },
          { headerName: 'Model', field: 'model' },
          { headerName: 'Price', field: 'price' },
        ],
        rowData: [],
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

export const InfiniteRowModelWithDatasource: Story = {
  render: () => ({
    components: { OeGrid },
    setup() {
      const gridOptions: GridOptions = {
        columnDefs: [
          {
            headerName: 'ID',
            maxWidth: 100,
            valueGetter: 'node.id',
            cellRenderer: (params: ICellRendererParams) => {
              if (params.value !== undefined) {
                return params.value;
              } else {
                return '<img src="https://www.ag-grid.com/example-assets/loading.gif">';
              }
            },
          },
          { field: 'athlete', minWidth: 150 },
          { field: 'age' },
          { field: 'country', minWidth: 150 },
          { field: 'year' },
          { field: 'date', minWidth: 150 },
          { field: 'sport', minWidth: 150 },
          { field: 'gold' },
          { field: 'silver' },
          { field: 'bronze' },
          { field: 'total' },
        ],
        defaultColDef: {
          flex: 1,
          resizable: true,
          minWidth: 100,
        },
        rowBuffer: 0,
        rowSelection: {
          mode: 'multiRow',
        },
        rowModelType: 'infinite',
        cacheBlockSize: 100,
        cacheOverflowSize: 2,
        maxConcurrentDatasourceRequests: 1,
        infiniteInitialRowCount: 1000,
        maxBlocksInCache: 10,
      };
      const onGridReady = (gridReadyEvent: GridReadyEvent) => {
        const updateData = (data: unknown[]) => {
          const dataSource: IDatasource = {
            getRows: (params: IGetRowsParams) => {
              // At this point in your code, you would call the server.
              // To make the demo look real, wait for 500ms before returning
              setTimeout(() => {
                // take a slice of the total rows
                const rowsThisPage = data.slice(params.startRow, params.endRow);
                // if on or after the last page, work out the last row.
                let lastRow = -1;
                if (data.length <= params.endRow) {
                  lastRow = data.length;
                }
                // call the success callback
                params.successCallback(rowsThisPage, lastRow);
              }, 500);
            },
          };
          gridReadyEvent.api.setGridOption('datasource', dataSource);
        };

        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
          .then((resp) => resp.json())
          .then((data) => updateData(data));
      };
      return { onGridReady, gridOptions };
    },
    template: `
      <oe-grid
        style="width: 100%; height:300px;"
        :grid-options="gridOptions"
        @grid-ready="onGridReady">
     </oe-grid>
`,
  }),
};

export const Pagination: Story = {
  render: () => ({
    components: { OeGrid },
    setup() {
      const gridOptions: GridOptions = {
        pagination: true,
        paginationAutoPageSize: true,
        columnDefs: [
          { headerName: 'Make', field: 'make', sortable: true },
          { headerName: 'Model', field: 'model', sortable: true },
          { headerName: 'Price', field: 'price', sortable: true },
        ],
        rowData: [
          { make: 'Toyota', model: 'Celica', price: 35000 },
          { make: 'Ford', model: 'Mondeo', price: 32000 },
          { make: 'Porsche', model: 'Boxster', price: 72000 },
          { make: 'Mercedes', model: 'A250e', price: 45000 },
          { make: 'VW', model: 'Golf', price: 30000 },
          { make: 'Skoda', model: 'Fabia', price: 22000 },
          { make: 'BMW', model: 'i4', price: 72000 },
          { make: 'Tesla', model: 'Model3', price: 50000 },
          { make: 'Polestar', model: '2', price: 45000 },
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
