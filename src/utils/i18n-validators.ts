import * as validators from '@vuelidate/validators';
import { createI18n } from 'vue-i18n';
import i18n from './i18n.json';

const { createI18nMessage } = validators;

// Create your i18n message instance. Used for vue-i18n@9
const withI18nMessage = createI18nMessage({
  t: createI18n({ ...i18n, locale: 'nl', legacy: false }).global.t.bind(i18n),
});

// wrap each validator.
export const required = withI18nMessage(validators.required);
export const requiredIf = withI18nMessage(validators.requiredIf, { withArguments: true });
// validators that expect a parameter should have `{ withArguments: true }` passed as a second parameter, to annotate they should be wrapped
export const minLength = withI18nMessage(validators.minLength, { withArguments: true });
// or you can provide the param at definition, statically
export const maxLength = withI18nMessage(validators.maxLength(10));
