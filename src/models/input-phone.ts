import type { CountryCode } from 'libphonenumber-js';

export interface IInputPhoneProps {
  modelValue: string;
}

export interface ICountryCode {
  value: string;
  description: string;
  code: CountryCode;
}
