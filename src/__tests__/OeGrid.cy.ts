import { defineComponent } from 'vue';
import OeGrid from '@components/grid/dumb/OeGrid.vue';

describe('Grid', () => {
  const TestComponent = defineComponent({
    components: { OeGrid },
    data: () => {
      return {
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
      };
    },
    template: '<oe-grid :grid-options="gridOptions" style="width: 100%; height: 300px" />',
  });

  beforeEach(() => {
    cy.mount(TestComponent);
  });

  it('renders an ag-grid', () => {
    cy.dataCy('ag-grid-vue').should('exist').should('have.class', 'ag-grid-vue');
  });

  it('uses the correct theme', () => {
    cy.dataCy('ag-grid-vue').should('have.class', 'ag-theme-balham');
  });

  it('renders the correct amount of columns', () => {
    cy.dataCy('ag-grid-vue').find('.ag-header-row-column').children().should('have.length', 3);
  });
});
