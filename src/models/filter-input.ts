export interface IFilterInputProps {
  api: string;
  options: IFilterOption[];
}

export interface IFilter {
  key: string;
  label: string;
  value: { label: string; value: string | number | boolean | unknown };
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
