export interface IContainerProps {
  activeTab?: ITab;
  tabs?: ITab[];
  disableConfirmCloseTab?: boolean;
  tabSelectorMaxWidth?: number;
}

export interface ITab {
  label: string;
  id: string;
  editMode: boolean;
  closable?: boolean;
  lastVisitedSubTab?: string;
}
