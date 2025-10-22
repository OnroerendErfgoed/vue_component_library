export * from './i18n-validators';
export * from './custom-validators';
export * from './polling';
export * from './openlayers/oe-ol-geolocate';
export * from './openlayers/map-util';
export * from './openlayers/projection-util';
export * from './object';

/*
  Log info messages to the console only in development mode for easier debugging.
*/
export const logInfo = (label: string): void => {
  const isDev =
    (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') ||
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'development');

  if (!isDev) return;

  console.info(
    `%c--- [Adres Component] ${label} ---`,
    'color: #31708f; background-color: #d9edf7; font-style: italic;'
  );
};
