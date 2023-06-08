export interface IFilterInputProps {
  api: string;
}

export interface IFilter {
  key: string;
  label: string;
  value: { label: string; value: string | number | boolean };
}

export interface IFilterOption {
  label: string;
  key: string;
  type: string;
}

export enum FilterOptionType {
  TEXT = 'text',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  DATE = 'date',
  RADIO = 'radio',
}
