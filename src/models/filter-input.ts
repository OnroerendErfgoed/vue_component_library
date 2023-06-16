import type { IGemeente } from './locatie';

export type TFilterInput = string | IGemeente;

export interface IFilterInputProps {
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
}

export interface IFilterTextProps {
  value?: string;
  placeholder?: string;
}

export interface IFilterSelectProps {
  value?: string;
  placeholder?: string;
  options?: IOption[];
}

export interface IFilterDatepickerProps {
  value?: string[];
}

export interface IFilterInputRadioProps {
  id: string;
  value?: string;
  options?: IOption[];
}

export interface IFilterGemeenteProps {
  api: string;
  value?: IGemeente;
}

export interface IOption {
  value: string;
  label: string;
}
