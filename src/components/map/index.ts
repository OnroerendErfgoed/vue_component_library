// Smart components
export { default as OeMap } from './smart/OeMap.vue';
export { default as OeMapLayerswitcher } from './smart/OeMapLayerswitcher.vue';
export { default as OeZoneerder } from './smart/OeZoneerder.vue';
export { default as OeZoneerderZonePanel } from './smart/OeZoneerderZonePanel.vue';

// Models
export * from './models/layer-type.enum';
export * from './models/openlayers';
export * from './models/map-config';
export * from './models/feature-select.enum';

// Utils
export * from './utils/openlayers/oe-ol-geolocate';
export * from './utils/openlayers/map-util';
export * from './utils/openlayers/projection-util';

// Common services used by this module
export { CrabApiService } from '@services/crab-api.service';

// Common components and directives used by this module
export { default as OeAutocomplete } from '@components/forms/dumb/OeAutocomplete.vue';
export { vClickOutside } from '@directives/click-outside.directive';

// Common enums and types used by this module
export type { IAutocompleteOption } from '@components/forms/models/autocomplete';
export * from '@models/locatie';

// Common utils used by this module
export { MapUtil } from '@components/map/utils/openlayers/map-util';
