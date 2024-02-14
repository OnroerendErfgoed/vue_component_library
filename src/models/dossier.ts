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
}
