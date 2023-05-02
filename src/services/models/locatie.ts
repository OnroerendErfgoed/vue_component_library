export interface Adres {
  id?: string;
  land: string;
  gemeente: string;
  postcode: string;
  straat: string;
  huisnummer: string;
  subadres: string;
}

export interface Land {
  id: string;
  naam: string;
  disabled?: boolean;
}

export interface Gemeente {
  id: number;
  naam: string;
  niscode: number;
}

export interface Postcode {
  id: number;
}

export interface Straat {
  id: number;
  naam: string;
  label?: string;
  status?: Status;
}

export interface Huisnummer {
  id: number;
  label: string;
  naam: string;
  status?: Status;
}

interface Status {
  definitie: string;
  id: string;
  naam: string;
}
