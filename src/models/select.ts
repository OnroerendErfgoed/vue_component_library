export interface ISelectProps<T> {
  modelValue: T;
  options: T[];
  placeholder: string;
  customLabel: (option: T) => T;
}

export interface ISelectOption {
  label: string;
  value: string;
}
