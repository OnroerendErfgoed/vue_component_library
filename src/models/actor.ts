import type { ISystemFields } from './system-fields';

export interface IActor {
  adres: IActorAdres;
  adressen: IActorAdres[];
  afkorting: string;
  emails: IEmail[];
  erkenningen: IErkenning[];
  id: number;
  ids: IId[];
  info: unknown[];
  naam: string;
  omschrijving: string;
  opmerkingen: string;
  relaties: IRelatie[];
  self: string;
  status: IActorStatus;
  systemfields: ISystemFields;
  telefoons: ITelefoon[];
  type: IType;
  types: string[];
  uri: string;
  urls: string[];
  voornaam: string;
  zichtbaarheid: IType;
}

interface IActorAdres {
  gemeente: IGemeente;
  land: ILand;
  postcode: IPostcode;
  straat: IStraat;
  adres: IAdresregisterAdres;
}

interface ILand {
  code: string;
  naam: string;
}

interface IGemeente {
  id?: number;
  naam: string;
  niscode: string;
  provincie?: IProvincie;
}

interface IPostcode {
  nummer: string;
  uri: string;
}

interface IStraat {
  id: string;
  naam: string;
  uri: string;
  omschrijving: string;
}

interface IAdresregisterAdres {
  id?: string;
  huisnummer?: string;
  busnummer?: string;
  uri?: string;
}

interface IProvincie {
  niscode: string;
  naam: string;
  gewest: IGewest;
}

interface IGewest {
  naam: string;
  niscode: string;
}

interface IEmail {
  email: string;
  type: IType;
}

interface IType {
  id: number;
  naam: string;
  uri?: string;
}

interface IErkenning {
  erkend_als: string;
  erkend_voor: string;
  erkenningsnummer: string;
  geldigheid: string;
  id: number;
  omschrijving: string;
  reden_erkenning: IRedenErkenning;
  type: string;
  type_erkenning_id: number;
  uri: string;
}

interface IRedenErkenning {
  id: number;
  reden_erkenning: string;
}

interface IId {
  extra_id: string;
  type: IType;
}

interface IRelatie {
  einddatum: string;
  id: number;
  omschrijving: string;
  startdatum: string;
  type: IType;
}

interface IActorStatus {
  datum: string;
  gebruiker: IActorStatusGebruiker;
  opmerkingen: string;
  status: IActorStatusStatus;
}

interface IActorStatusGebruiker {
  uri: string;
  omschrijving: string;
}

interface IActorStatusStatus {
  id: number;
  status: string;
}

interface ITelefoon {
  landcode: string;
  nummer: string;
  type: IType;
  volledig_nummer: string;
}
