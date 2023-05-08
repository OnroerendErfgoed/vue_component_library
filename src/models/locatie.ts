export interface AdresNew {
  id?: string;
  land: string;
  gemeente: string;
  postcode: string;
  straat: string;
  huisnummer: string;
  busnummer: string;
}

export interface Adres {
  id: string;
  uri: string;
  label: string;
  huisnummer: string;
  busnummer: string;
  status: string;
}

export interface Land {
  id: string;
  naam: string;
  disabled?: boolean;
}

export interface Gewest {
  id: number;
  naam: string;
  niscode: string;
}

export interface Provincie {
  niscode: string;
}

export interface Gemeente {
  naam: string;
  niscode: string;
  provincie: Provincie;
}

export interface Postinfo {
  names: string[];
  postcode: string;
  status: string;
  uri: string;
}

export interface Straat {
  id: string;
  naam: string;
  status: string;
  uri: string;
}
