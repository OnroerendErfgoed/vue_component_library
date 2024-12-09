<template>
  <div class="vl-properties__column">
    <h4 class="vl-title vl-title--h4">Workflow</h4>
  </div>
  <div class="vl-col--12-12">
    <oe-grid :grid-options="gridOptions" @first-data-rendered="firstDataRendered" @grid-ready="onGridReady" />
  </div>
</template>
<script setup lang="ts">
import { NoRowsOverlay } from '.';
import { format } from 'date-fns';
import { getCurrentInstance, ref } from 'vue';
import OeGrid from '@components/dumb/OeGrid.vue';
import type {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-community';
import type { GridWorkflowProps, IWorkflow, IWorkflowOwner, IWorkflowState } from '@models/workflow';

const props = defineProps<GridWorkflowProps>();

// Grid
const gridApi = ref<GridApi>();
const getColumnDefinitions = (): ColDef[] => {
  return [
    { headerName: 'Status', field: 'state.id', flex: 1, cellRenderer: statusCellRenderer },
    { headerName: 'Qualifier', field: 'state.state_qualifier', cellRenderer: qualifierCellRenderer, flex: 1 },
    { headerName: 'Toegewezen aan', field: 'owners', valueFormatter: ownerValueFormatter, flex: 1 },
    { headerName: 'Datum aanpassing', field: 'datum', valueFormatter: dateFormatter, flex: 1, sort: 'desc' },
    { headerName: 'Aangepast door', field: 'actor_omschrijving', flex: 1 },
    { headerName: 'Opmerkingen', field: 'state', valueFormatter: remarkValueFormatter, flex: 1 },
  ];
};

const statusCellRenderer = (params: ICellRendererParams<number>) => {
  if (params.value || params.value === 0) {
    const state = props.schema.find((s) => s.id === params.value);
    if (state) {
      return state.description;
    }
    const errorElement = document.createElement('i');
    errorElement.innerHTML = `Foute state ID: ${params.value}`;
    errorElement.classList.add('invalid-status');
    return errorElement;
  }
  return '';
};

const qualifierCellRenderer = (params: ICellRendererParams<IWorkflow, number>) => {
  if (params.value || params.value === 0) {
    const state = props.schema.find((s) => s.id === params.data?.state.id);
    if (state) {
      const qualifier = state.qualifiers.find((q) => q.id === params.value);
      return qualifier?.description || '';
    }
    const errorElement = document.createElement('i');
    errorElement.innerHTML = `Foute state ID: ${params.value}`;
    errorElement.classList.add('invalid-status');
    return errorElement;
  }
  return '';
};

const ownerValueFormatter = (params: ValueFormatterParams<IWorkflow, IWorkflowOwner[]>) => {
  if (params.value) {
    params.value = params.value.filter((v) => v.omschrijving);
    return params.value.map((o) => o.omschrijving).join('; ');
  }

  return '';
};

const remarkValueFormatter = (params: ValueFormatterParams<IWorkflowState, IWorkflowState>) => {
  return params.value?.comment || '-';
};

const dateFormatter = (params: ValueFormatterParams) => {
  if (params.value) {
    return format(new Date(params.value || ''), 'dd-MM-yyyy HH:mm');
  }
  return '';
};

const gridOptions = ref<GridOptions>({
  context: getCurrentInstance(),
  defaultColDef: { sortable: true, resizable: true },
  suppressMovableColumns: true,
  suppressClickEdit: true,
  headerHeight: 45,
  rowHeight: 40,
  rowModelType: 'clientSide',
  rowData: [],
  enableBrowserTooltips: true,
  columnDefs: getColumnDefinitions(),
  noRowsOverlayComponent: NoRowsOverlay,
  noRowsOverlayComponentParams: {
    noRowsMessage: 'Er zijn nog geen workflow gegevens beschikbaar',
  },
  suppressBrowserResizeObserver: true,
  domLayout: 'autoHeight',
});

const onGridReady = (gridReadyEvent: GridReadyEvent) => {
  gridApi.value = gridReadyEvent.api;
  gridApi.value?.setRowData(props.data);
};

const firstDataRendered = () => {
  resizeColumns();
  gridApi.value?.setRowData(props.data);
};

const resizeColumns = async () => {
  gridApi.value?.sizeColumnsToFit();
};
</script>
<style lang="scss">
.invalid-status {
  font-style: italic !important;
}
</style>
