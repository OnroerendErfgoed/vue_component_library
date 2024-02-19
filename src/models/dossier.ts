export interface IMenuTab {
  index: number;
  id: string;
  class: string;
}

export interface IDossierQuery {
  sort?: string;
  eigenaar?: string;
  state?: number | string;
  dringend?: number;
  tekst?: string;
}

export interface IDossierTabs {
  [k: string]: IDossierTab;
}

export interface IDossierTab {
  index: number;
  label: string;
  id: string;
  invalid: boolean;
  class?: string;
}

export interface IEnumType {
  naam: string;
  id: number;
}
