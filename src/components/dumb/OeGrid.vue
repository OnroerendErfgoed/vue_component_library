<template>
  <AgGridVue data-cy="ag-grid-vue" class="ag-grid-vue ag-theme-balham" />
</template>

<script setup lang="ts">
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnAutoSizeModule,
  InfiniteRowModelModule,
  ModuleRegistry,
  PaginationModule,
  RowSelectionModule,
  ValidationModule,
} from 'ag-grid-community';
import { AgGridVue } from 'ag-grid-vue3';

ModuleRegistry.registerModules([
  InfiniteRowModelModule,
  ClientSideRowModelModule,
  ValidationModule,
  ColumnAutoSizeModule,
  PaginationModule,
  RowSelectionModule,
  CellStyleModule,
]);
</script>

<style lang="scss">
@import 'pyoes/scss/base-variables';

.ag-grid-vue {
  .ag-ltr .ag-header-cell::after {
    display: none;
  }

  .ag-row,
  .ag-header-row {
    .ag-cell,
    .ag-header-cell {
      border-color: #ddd;
      border-style: solid;
      border-width: 0 1px 1px 0;
    }
  }

  &.ag-theme-balham {
    -webkit-font-smoothing: antialiased;
    background-color: $white;
    color: $jet;
    font-family: 'Flanders Art Sans', Arial, sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: normal;
  }

  .ag-overlay-wrapper {
    background-color: aliceblue;

    &.ag-overlay-no-rows-wrapper {
      padding-top: 0;
    }
  }

  .ag-root-wrapper {
    .ag-header {
      background-color: #eee;

      .ag-header-row {
        border-bottom: 1px solid #ddd;
      }

      .ag-cell-label-container,
      .ag-header-cell-label {
        height: inherit;
        width: inherit;
        color: $jet;
      }

      .ag-header-cell-sortable {
        cursor: pointer;
      }

      .ag-header-icon {
        position: absolute;
        right: 5px;
        transform: scale(0.75);
      }
    }

    .ag-row.ag-row-odd {
      background-color: $light-gray;
    }

    .ag-header-cell-label,
    .ag-cell {
      display: flex;
      align-items: center;
      padding: 5px;
      border: none;

      select {
        height: auto;
        margin: 0;

        &:disabled {
          background: none;
          border: none;
        }
      }
    }

    .ag-header-cell-resize {
      position: absolute;
      right: 0;
    }

    .ag-cell-focus {
      outline: none;

      &:focus-within {
        border-color: $primary-color;
      }
    }

    .ag-cell .cell-checkbox {
      color: $mid-purple;
    }

    .ag-body-viewport {
      .ag-body-container.ag-layout-auto-height {
        display: block;
        min-height: 0;
        margin-bottom: 0;
      }

      .ag-row-selected {
        background-color: $silver;

        .ag-cell .cell-checkbox:before {
          content: '\f046';
          font-family: 'FontAwesome';
        }
      }

      .acties-cell {
        justify-content: center;

        i.fa,
        a.fa {
          cursor: pointer;
          color: $dark-purple;

          + .fa {
            margin-left: 5px;
          }
        }
      }

      .icon-cell {
        display: flex;
        justify-content: center;

        i.fa.fa-check {
          color: $success-color;
          cursor: default;
        }

        i.fa.fa-times {
          color: $alert-color;
          cursor: default;
        }
      }
    }
  }
}
</style>
