import type { ILocatieAdres } from '@models/locatie';

export interface IAdresProps {
  hideTitle?: boolean;
  titleText?: string;
  modDisabled?: boolean;
  modStackedLarge?: boolean;
  modStackedSmall?: boolean;
  modStacked?: boolean;
  api?: string;
  config?: IAdresConfig;
  countryId?: string;
  adres?: ILocatieAdres;
  optionsLimit?: number;
  showRequiredPerField?: boolean;
}

export interface IAdresConfig {
  land?: IConfigOption;
  gewest?: IConfigOption;
  provincie?: IConfigOption;
  gemeente?: IConfigOption;
  postcode?: IConfigOption;
  straat?: IConfigOption;
  huisnummer?: IConfigOption;
  busnummer?: IConfigOption;
}

interface IConfigOption {
  required: boolean;
  hidden?: boolean;
}
