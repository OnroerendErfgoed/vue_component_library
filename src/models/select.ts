export interface ISelectProps {
  model: any;
  options: any[];
  customLabel: (option: any) => {};
  placeholderText: string;
}

export interface ISelectOption {
  label: string;
  value: string;
}
