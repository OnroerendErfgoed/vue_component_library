<template>
  <oe-grid
    style="width: 100%; height: 100%"
    :grid-options="gridOptions"
    @grid-ready="onGridReady"
    @first-data-rendered="firstDataRendered"
    @row-clicked="gridOptions?.onRowClicked"
  />
</template>

<script setup lang="ts">
import OeGrid from '../dumb/OeGrid.vue';
// import { NoRowsOverlayComponent } from 'ag-grid-community/dist/lib/rendering/overlays/noRowsOverlayComponent';
import { getCurrentInstance, ref } from 'vue';
import type { ColDef, FirstDataRenderedEvent, GridOptions, RowClickedEvent } from 'ag-grid-community';

const getColumnDefinitions = (): ColDef[] => {
  return [
    { headerName: 'ID', field: 'id', width: 75, sort: 'desc' },
    { headerName: 'Onderwerp', field: 'onderwerp', width: 150 },
    { headerName: 'ID aanvraag', field: 'energieadvies.id', width: 75 },
    { headerName: 'Adres', field: 'adres', width: 150 },
  ];
};

const gridOptions = ref<GridOptions>({
  context: getCurrentInstance(),
  defaultColDef: { sortable: true, resizable: true },
  suppressMovableColumns: false,
  suppressClickEdit: true,
  headerHeight: 45,
  rowHeight: 40,
  rowModelType: 'infinite',
  infiniteInitialRowCount: 1,
  cacheBlockSize: 50,
  rowData: null,
  enableBrowserTooltips: true,
  columnDefs: getColumnDefinitions(),
  onRowClicked: (event: RowClickedEvent) => {
    console.log(event);
    // Select actor
  },
});

const onGridReady = () => {
  setRowData();
};
const firstDataRendered = (grid: FirstDataRenderedEvent) => grid.api.sizeColumnsToFit();
const setRowData = () => {
  /*const dataSource = {
    getRows: (params: IGetRowsParams) => {
      const query = setQueryParameters(params);
      sharedStore.startLoading('get-dossiers');

      apiService
        .getDossiers(params.startRow, params.endRow, query)
        .then((data: IResponse<IDossierOverzichtItem>) => {
          const content = data.content;
          rowCount.value = +data.lastRow;
          if (data.lastRow === 0) {
            params.successCallback([], 0);
            gridOptions.value.api?.showNoRowsOverlay();
          } else {
            gridOptions.value.api?.hideOverlay();
            params.successCallback(content, +data.lastRow);
            onGridSizeChanged();
          }
        })
        .catch(() => {
          params.failCallback();
        })
        .catch(() => params.failCallback())
        .finally(() => sharedStore.stopLoading('get-dossiers'));
    },
  };
  gridOptions.value.api?.setDatasource(dataSource); */
};
</script>

<style lang="scss"></style>
