import type { ILocatieAdres } from '@models/locatie';

export interface IAdresComponentProps {
  api?: string;
  config?: IAdresComponentConfig;
  countryId?: string;
  adres?: ILocatieAdres;
  optionsLimit?: number;
}

export interface IAdresComponentConfig {
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
