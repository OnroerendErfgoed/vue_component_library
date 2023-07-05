import type { CountryCode } from 'libphonenumber-js';

export interface ICountryCode {
  value: string;
  description: string;
  code: CountryCode;
}
