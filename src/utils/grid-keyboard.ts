import type { SuppressKeyboardEventParams } from 'ag-grid-community';

const CELL_ACTION_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const tabIntoCellActions = ({ event }: SuppressKeyboardEventParams) => {
  if (event.key !== 'Tab') return false;

  const eGridCell = (event.target as HTMLElement | null)?.closest<HTMLElement>('.ag-cell');
  if (!eGridCell) return false;

  const cellActions = Array.from(eGridCell.querySelectorAll<HTMLElement>(CELL_ACTION_SELECTOR));
  if (!cellActions.length) return false;

  const active = document.activeElement;
  if (event.shiftKey) {
    return active !== eGridCell && active !== cellActions[0];
  }
  return active !== cellActions[cellActions.length - 1];
};
