<template>
  <div class="vl-u-flex vl-u-flex-direction-column">
    <vl-grid>
      <vl-column width="12" class="vl-u-flex vl-u-flex-align-flex-end">
        <vl-search
          id="actor-widget-menu-search"
          v-model="zoekterm"
          data-cy="actor-widget-menu-search"
          name="actor-widget-menu-search"
          mod-inline
          mod-alt
          placeholder="Geef een zoekterm in"
          @click="handleSearchClick"
          @submit="triggerSearch"
          @input="zoekterm = $event.target.value"
        ></vl-search>
      </vl-column>
    </vl-grid>
    <vl-grid class="vl-u-spacer-top--xsmall">
      <vl-column width="12">
        <vl-action-group mod-space-between class="vl-u-flex-v-flex-end">
          <span class="vl-u-mark--info vl-u-text--small">{{ rowCountText }}</span>
          <div>
            <a :href="`${props.api}/beheer/0`" target="_blank">
              <vl-button icon="plus" mod-icon-before mod-naked> Actor aanmaken </vl-button>
            </a>
            <vl-button icon="synchronize" mod-icon-before mod-naked @click="refresh()">Vernieuwen</vl-button>
          </div>
        </vl-action-group>
      </vl-column>
    </vl-grid>
    <vl-grid class="vl-u-spacer-top--xsmall">
      <vl-column width="12">
        <oe-grid
          class="table"
          :grid-options="gridOptions"
          @grid-ready="onGridReady"
          @first-data-rendered="firstDataRendered"
          @row-clicked="gridOptions?.onRowClicked"
        ></oe-grid>
      </vl-column>
    </vl-grid>
  </div>
</template>

<script setup lang="ts">
import { VlActionGroup, VlButton, VlColumn, VlGrid, VlSearch } from '@govflanders/vl-ui-design-system-vue3';
import { isEmpty, omitBy } from 'lodash';
import { computed, getCurrentInstance, ref, watch } from 'vue';
import { OeActorWidgetGridActies } from '@components/dumb';
import OeGrid from '@components/dumb/OeGrid.vue';
import { ActorService, type IActorenQuery } from '@services/actor.service';
import type { ColDef, FirstDataRenderedEvent, GridOptions, IGetRowsParams, RowClickedEvent } from 'ag-grid-community';
import type { ActorType, IActor } from '@models/actor';

export interface IOeActorWidgetGridProps {
  api: string;
  getSsoToken?: () => Promise<string>;
  actorType?: ActorType;
  searchActor?: string;
}

const props = withDefaults(defineProps<IOeActorWidgetGridProps>(), {
  api: '',
  getSsoToken: undefined,
  actorType: undefined,
  searchActor: '',
});
const emit = defineEmits<{
  selectActor: [IActor | undefined];
  setStateDetail: [number];
  setLoading: [boolean];
}>();

const actorService = new ActorService(props.api, props.getSsoToken);

// Search
const zoekterm = ref('');
const search = () => {
  resetSelectedActor();
  gridOptions.value.api?.purgeInfiniteCache();
};
const triggerSearch = (event: Event) => {
  event.preventDefault();
  search();
};
const handleSearchClick = (event: Event) => {
  // If reset X was clicked - currently no close event emitted
  if ((event.target as HTMLInputElement).classList.contains('vl-search__reset')) {
    zoekterm.value = '';
    search();
  }
};
const refresh = () => {
  // reset sort values
  gridOptions.value.columnApi?.resetColumnState();
  search();
};
watch(
  () => props.searchActor,
  () => {
    zoekterm.value = props.searchActor;
  },
  { immediate: true }
);
// Grid
const rowCount = ref(0);
const getColumnDefinitions = (): ColDef[] => {
  return [
    { headerName: '#', field: 'id', width: 50 },
    { headerName: 'Naam', field: 'naam', flex: 1 },
    { headerName: 'Voornaam', field: 'voornaam', flex: 1 },
    { headerName: 'Type', field: 'type.naam', colId: 'type', flex: 1 },
    {
      headerName: 'Acties',
      width: 60,
      cellClass: 'acties-cell',
      cellRenderer: OeActorWidgetGridActies,
      cellRendererParams: {
        setStateDetail: (id: number) => emit('setStateDetail', id),
        actorenUrl: props.api,
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
  suppressCellFocus: true,
  rowSelection: 'single',
  headerHeight: 45,
  rowHeight: 40,
  rowModelType: 'infinite',
  infiniteInitialRowCount: 1,
  cacheBlockSize: 50,
  rowData: null,
  overlayNoRowsTemplate: '<span class="no-rows">Er zijn geen resultaten</span>',
  enableBrowserTooltips: true,
  columnDefs: getColumnDefinitions(),
  onRowClicked: (event: RowClickedEvent) => {
    emit('selectActor', event.data);
  },
});
const onGridReady = () => setRowData();
const firstDataRendered = (grid: FirstDataRenderedEvent) => grid.api.sizeColumnsToFit();
const onGridSizeChanged = () => gridOptions.value.api?.sizeColumnsToFit();
const rowCountText = computed(() =>
  rowCount.value === 1 ? `Er is 1 resultaat gevonden` : `Er zijn ${rowCount?.value || 'geen'} resultaten gevonden`
);
const setQueryParameters = (params: IGetRowsParams): IActorenQuery => {
  const paramsObj: IActorenQuery = {
    omschrijving: zoekterm.value,
    sort: undefined,
    type: props.actorType,
  };

  if (params.sortModel.length) {
    const sortModel = params.sortModel[0];
    paramsObj.sort = (sortModel.sort === 'asc' ? '' : '-') + sortModel.colId;
  }

  return omitBy(paramsObj, (v) => isEmpty(v));
};

const setRowData = () => {
  const dataSource = {
    getRows: (params: IGetRowsParams) => {
      const query = setQueryParameters(params);
      emit('setLoading', true);

      actorService
        .getActoren(params.startRow, params.endRow, query)
        .then((data) => {
          const content = data.content;
          rowCount.value = +data.lastRow;
          params.successCallback(content, +data.lastRow);
          onGridSizeChanged();
        })
        .catch(() => params.failCallback())
        .finally(() => emit('setLoading', false));
    },
  };
  gridOptions.value.api?.setDatasource(dataSource);
};

const resetSelectedActor = () => {
  gridOptions.value.api?.deselectAll();
  emit('selectActor', undefined);
};
defineExpose({ resetSelectedActor });
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables';
.table {
  height: 400px;

  :deep(.ag-row-selected) {
    background-color: transparent !important;
    &::before {
      background: $info-color !important;
    }
  }
}
</style>
