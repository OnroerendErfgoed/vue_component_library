// Address component
export { default as OeAdres } from './OeAdres.vue';

// Address models
export * from './models/adres';

// Common components used by this module
export { default as OeAutocomplete } from '../../components/forms/dumb/OeAutocomplete.vue';
export { default as OeLoader } from '../../components/core/dumb/OeLoader.vue';

// Common services used by this module
export { CrabApiService } from '../../services/crab-api.service';

// Common enums and types used by this module
export * from '../../models/locatie';
export { Niscode } from '../../models/niscode.enum';
export type { IAutocompleteOption } from '../../components/forms/models/autocomplete';

// Common utils used by this module
export { removeEmptyValues } from '../../utils/object';
export { requiredIf } from '../../utils/i18n-validators';
