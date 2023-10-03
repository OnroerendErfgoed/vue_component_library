import type { ISystemFields } from './system-fields';

export interface IActor {
  id: number;
  uri: string;
  self: string;
  type: {
    id: number;
    naam: string;
    uri: string;
  };
  zichtbaarheid: {
    id: number;
    naam: string;
  };
  omschrijving: string;
  naam: string;
  voornaam: string;
  status: {
    id: number;
    status: string;
  };
  systemfields: ISystemFields;
}
