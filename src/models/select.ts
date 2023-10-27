export interface ISelectProps {
  model: any;
  options: any[];
  customLabel: (option: any) => {};
}

export interface ISelectOption {
  label: string;
  value: string;
}
