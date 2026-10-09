import isUndefined from 'lodash-es/isUndefined';
import { formatDate, formatNumber } from '@utils/formatters';
import type { ITooltipParams, ValueFormatterParams } from 'ag-grid-community';

export const datumValueFormatter = (params: Partial<ValueFormatterParams | ITooltipParams>) => {
  if (params.value) {
    return formatDate(params.value);
  }
  return '';
};

export const emptyValueFormatter = (params: ValueFormatterParams<string>) => {
  return params.value || '-';
};

export const numberValueFormatter = (
  params: Partial<ValueFormatterParams | ITooltipParams>,
  options: Intl.NumberFormatOptions = {}
) => {
  if (params.value) {
    return formatNumber(params.value, options);
  }
  return '';
};

export const booleanValueFormatter = (params: Partial<ValueFormatterParams | ITooltipParams>) => {
  if (!isUndefined(params.value)) {
    if (params.value) {
      return 'Ja';
    }
    return 'Nee';
  }
  return '';
};
