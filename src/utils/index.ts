export * from './i18n-validators';
export * from './custom-validators';
export * from './polling';
export * from './openlayers/oe-ol-geolocate';
export * from './openlayers/map-util';
export * from './openlayers/projection-util';
export * from './object';

export const logInfo = (label: string) =>
  console.info(
    `%c--- [Adres Component] ${label} ---`,
    'color: #31708f; background-color: #d9edf7; font-style: italic;'
  );
