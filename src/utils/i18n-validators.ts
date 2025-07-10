import { bicValidator, ibanValidator, kboValidator, rrnValidator } from './custom-validators';
import i18n from './i18n.json';
import * as validators from '@vuelidate/validators';
import { createI18n } from 'vue-i18n';

const { createI18nMessage } = validators;

// Create your i18n message instance. Used for vue-i18n@9
const withI18nMessage = createI18nMessage({
  t: createI18n({ ...i18n, locale: 'nl', legacy: false }).global.t.bind(i18n),
});

// wrap each validator.
export const required = withI18nMessage(validators.required);
export const email = withI18nMessage(validators.email);
export const kbo = withI18nMessage(kboValidator);
export const rrn = withI18nMessage(rrnValidator);
export const iban = withI18nMessage(ibanValidator);
export const bic = withI18nMessage(bicValidator);
// validators that expect a parameter should have `{ withArguments: true }` passed as a second parameter, to annotate they should be wrapped
export const requiredIf = withI18nMessage(validators.requiredIf, { withArguments: true });
export const minLength = withI18nMessage(validators.minLength, { withArguments: true });
export const maxLength = withI18nMessage(validators.maxLength, { withArguments: true });
