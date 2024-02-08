export interface IAutocompleteProps {
  value?: IAutocompleteOption;
  id?: string;
  minChars?: number;
  autoselect?: boolean;
  placeholder?: string;
  callbackFn?: (searchTerm: string) => Promise<IAutocompleteOption[]>;
  allowFreeText?: boolean;
}

export interface IAutocompleteOption<T = unknown> {
  title: string;
  subtitle?: string;
  value?: T;
}
