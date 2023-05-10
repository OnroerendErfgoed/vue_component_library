export interface IAdresNew {
  id?: string;
  land: string;
  gemeente: string;
  postcode: string;
  straat: string;
  huisnummer: string;
  busnummer: string;
}

export interface IAdres {
  id: string;
  uri: string;
  label: string;
  huisnummer: string;
  busnummer: string;
  status: string;
}

export interface ILand {
  id: string;
  naam: string;
  disabled?: boolean;
}

export interface IGewest {
  id: number;
  naam: string;
  niscode: string;
}

export interface IProvincie {
  niscode: string;
}

export interface IGemeente {
  naam: string;
  niscode: string;
  provincie: IProvincie;
}

export interface IPostinfo {
  names: string[];
  postcode: string;
  status: string;
  uri: string;
}

export interface IStraat {
  id: string;
  naam: string;
  status: string;
  uri: string;
}
