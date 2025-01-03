export interface ILocatieAdres {
  land: {
    code?: string;
    naam?: string;
  };
  gemeente: {
    niscode?: string;
    naam?: string;
  };
  postcode: {
    uri?: string;
    nummer?: string;
  };
  straat: {
    id?: string;
    uri?: string;
    naam?: string;
  };
  adres: {
    id?: string;
    uri?: string;
    huisnummer?: string;
    busnummer?: string;
  };
}

export interface IAdres {
  id: string;
  uri: string;
  label: string;
  status: string;
  huisnummer: string;
  busnummer: string;
}

export interface ILand {
  code: string;
  naam?: string;
}

export interface IGewest {
  naam: string;
  niscode: string;
}

export interface IProvincie {
  niscode: string;
  naam: string;
  gewest: IGewest;
}

export interface IGemeente {
  naam: string;
  niscode: string;
  provincie: IProvincie;
  status?: string;
}

export interface IPostinfo {
  namen: string[];
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

export interface ILocatie {
  id: string;
  locatie: string;
}

export interface IBoundingBox {
  lowerleft: { lat: number; lon: number };
  upperright: { lat: number; lon: number };
}

export interface IGeoLocation {
  boundingbox: IBoundingBox;
  id: string;
  locatie: string;
  type: string;
}
