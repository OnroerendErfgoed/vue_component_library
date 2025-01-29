import type { IGemeente } from './locatie';
import { Niscode } from './niscode.enum';

export type TFilterInput = string | IGemeente;

export interface IFilterInputProps {
  options: IFilterOption[];
  defaultFilters?: IFilter[];
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
  apiFormat?: string;
}

export interface IFilterInputRadioProps {
  id: string;
  value?: string | boolean | number;
  options?: IOption[];
}

export interface IFilterGemeenteProps {
  api: string;
  value?: string;
  gewest?: Niscode;
}

export interface IFilterActorProps {
  id: string;
  api: string;
  value?: string;
  getSsoToken: () => Promise<string>;
}

export interface IFilterProvincieProps {
  api: string;
  value?: string;
}

export interface IFilterAanduidingsobjectProps {
  id: string;
  api: string;
  value?: string;
}

export interface IOption {
  value: string | boolean | number;
  label: string;
}
