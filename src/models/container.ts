export interface IContainerProps {
  activeTab?: ITab;
  tabs?: ITab[];
}

export interface ITab {
  label: string;
  id: string;
  closable?: boolean;
  lastVisitedSubTab?: string;
}
