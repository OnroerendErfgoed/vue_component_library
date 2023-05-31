import type { ILocatieAdres } from '@models/locatie';

export interface IAdresCrabProps {
  api?: string;
  config?: IAdresCrabConfig;
  countryId?: string;
  adres?: ILocatieAdres;
  optionsLimit?: number;
}

export interface IAdresCrabConfig {
  land?: IConfigOption;
  gemeente?: IConfigOption;
  postcode?: IConfigOption;
  straat?: IConfigOption;
  huisnummer?: IConfigOption;
  busnummer?: IConfigOption;
}

interface IConfigOption {
  required: boolean;
}
