<template>
  <div class="vl-layout vl-u-flex vl-u-flex-direction-column">
    <div class="vl-grid">
      <div class="vl-col--12-12 vl-u-flex vl-u-flex-align-space-between">
        <span class="vl-u-mark--info vl-u-text--small">{{ rowCountText }}</span>
        <vl-button class="refresh-button" icon="synchronize" mod-icon-before mod-naked @click="search"
          >Vernieuwen</vl-button
        >
      </div>
    </div>
    <div class="vl-grid table">
      <div class="vl-col--12-12 vl-u-flex oe-flex-1">
        <oe-grid
          style="width: 100%; height: 500px"
          :grid-options="gridOptions"
          @grid-ready="onGridReady"
          @first-data-rendered="firstDataRendered"
          @row-clicked="gridOptions?.onRowClicked"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OeGrid from '../dumb/OeGrid.vue';
import OeActorWidgetGridActies from './OeActorWidgetGridActies.vue';
import { VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { computed, getCurrentInstance, ref } from 'vue';
import type { ColDef, FirstDataRenderedEvent, GridOptions, IGetRowsParams, RowClickedEvent } from 'ag-grid-community';
import type { IActor } from '@models/actor';
import type { ActorService } from '@services/actor.service';

interface IOeActorWidgetGridProps {
  service: ActorService;
}

const props = withDefaults(defineProps<IOeActorWidgetGridProps>(), {
  service: undefined,
});
const emit = defineEmits<{
  selectActor: [IActor];
  setStateDetail: [number];
}>();
const rowCount = ref(0);

const getColumnDefinitions = (): ColDef[] => {
  return [
    { headerName: '#', field: 'id', sort: 'desc', width: 50 },
    { headerName: 'Naam', field: 'naam', width: 200 },
    { headerName: 'Voornaam', field: 'voornaam', width: 200 },
    { headerName: 'Type', field: 'type.naam', colId: 'type', width: 200 },
    {
      headerName: 'Acties',
      width: 55,
      cellClass: 'acties-cell',
      cellRenderer: OeActorWidgetGridActies,
      cellRendererParams: {
        setStateDetail: (id: number) => emit('setStateDetail', id),
        actorenUrl: props.service.API_URL,
      },
      sortable: false,
    },
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
    emit('selectActor', event.data);
  },
});

const onGridReady = () => {
  setRowData();
};
const search = () => gridOptions.value.api?.purgeInfiniteCache();
const firstDataRendered = (grid: FirstDataRenderedEvent) => grid.api.sizeColumnsToFit();
const onGridSizeChanged = () => gridOptions.value.api?.sizeColumnsToFit();
const rowCountText = computed(() =>
  rowCount.value === 1 ? `Er is 1 resultaat gevonden` : `Er zijn ${rowCount?.value || 'geen'} resultaten gevonden`
);
const setRowData = () => {
  const dataSource = {
    getRows: (params: IGetRowsParams) => {
      console.log('start loader');

      props.service
        .getActoren(params.startRow, params.endRow, {})
        .then((data) => {
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
        .finally(() => console.log('stop loader'));
    },
  };
  gridOptions.value.api?.setDatasource(dataSource);
};
</script>

<style lang="scss" scoped>
.table {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0.9375rem 0;
}
</style>
