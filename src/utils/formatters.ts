import { format } from 'date-fns';

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return '';
  }
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) {
    return '';
  }
  return format(date, 'dd-MM-yyyy');
}

export function formatNumber(
  value: string | number | null | undefined,
  options: Intl.NumberFormatOptions = {}
): string {
  if (value === null || value === undefined) {
    return '';
  }
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(numberValue)) {
    return '';
  }
  const formatter = new Intl.NumberFormat('nl-BE', options);
  return formatter.format(numberValue).replace(/\./g, ' ');
}
