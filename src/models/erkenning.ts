export interface IErkenning {
  id: number;
  einddatum?: string;
  startdatum?: string;
  erkend_als: IErkendAls;
  erkenningsnummer: string;
  oorsprong_erkenning?: IOorsprongErkenning;
  opmerkingen?: string;
  reden_erkenning?: IRedenErkenning;
  omschrijving?: string;
  type: string;
}

export interface IErkendAls {
  id: number;
  type_erkenning: string;
  erkend_als: string;
}

export interface IOorsprongErkenning {
  type: string;
  uri: string;
}

export interface IRedenErkenning {
  id: number;
  reden_erkenning: string;
}
