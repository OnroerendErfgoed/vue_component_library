export interface IAutocompleteProps {
  value: IAutocompleteOption;
  id?: string;
  minChars?: number;
  autoselect?: boolean;
  placeholder?: string;
  callbackFn?: (searchTerm: string) => Promise<IAutocompleteOption[]>;
}

export interface IAutocompleteOption {
  title: string;
  subtitle?: string;
  value?: any;
}
