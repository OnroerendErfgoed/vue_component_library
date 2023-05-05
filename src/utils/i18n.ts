import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  locale: 'nl',
  messages: {
    nl: {
      validations: {
        required: 'Het veld {property} is verplicht.',
        minLength: "Het veld {property} heeft de waarde '{model}', maar het moet een minimale lengte van {min} hebben.",
      },
    },
  },
});
