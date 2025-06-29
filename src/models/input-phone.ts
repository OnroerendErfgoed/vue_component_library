import type { CountryCode } from 'libphonenumber-js';

export interface IInputPhoneProps {
  id: string;
  modelValue: string;
  prefixClass?: string;
  inputFieldClass?: string;
}

export interface ICountryCode {
  value: string;
  description: string;
  code: CountryCode;
}
