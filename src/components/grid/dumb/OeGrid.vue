<template>
  <AgGridVue data-cy="ag-grid-vue" class="ag-grid-vue ag-theme-balham" />
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3';
</script>

<style lang="scss">
@import '@OnroerendErfgoed/pyoes/scss/base-variables';

.ag-grid-vue {
  // ag-Grid v36 applies header background via CSS variable, not directly on .ag-header
  &.ag-theme-balham {
    --ag-header-background-color: #eee;
  }

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
      padding: 0;
    }
  }

  .ag-overlay-wrapper {
    background-color: aliceblue;

    &.ag-overlay-no-rows-wrapper {
      padding-top: 0;
    }
  }

  .ag-root-wrapper {
    .ag-header {
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

    // .ag-body-viewport and .ag-body-container are removed in ag-Grid v36
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
      a.fa,
      svg {
        cursor: pointer;
        color: $primary-color;

        + .fa,
        + svg {
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
</style>
