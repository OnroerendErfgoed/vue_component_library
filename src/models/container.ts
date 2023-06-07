export interface IContainerProps {
  tabs?: ITab[];
}

export interface ITab {
  label: string;
  id: string;
  closable?: boolean;
}
