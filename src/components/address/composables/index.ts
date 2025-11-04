import { IAdresProps } from '../models/adres';
import { logInfo } from '../utils';
import { createApiHelpers } from './api-helpers';
import { createAdresBuilders } from './builders';
import { createInitializers } from './initialization';
import { useAdresState } from './state';
import { setupWatchers } from './watchers';
import { computed } from 'vue';
import { CrabApiService } from '@services/crab-api.service';
import type { IGemeente, ILand } from '@models/locatie';

export type ResetLevel = 'land' | 'gewest' | 'provincie' | 'gemeente' | 'straat' | 'huisnummer';

export const useAdresLogic = (props: IAdresProps, emit: (event: 'update:adres', ...args: unknown[]) => void) => {
  logInfo('useAdresLogic');

  // Initialize state
  const state = useAdresState();

  // Initialize CRAB API service
  const crabApiService = new CrabApiService(props.api || '');

  // Helpers
  const isBelgium = () => (state.land.value as ILand)?.code === 'BE';
  const isBelgiumOrEmpty = () => !state.land.value || isBelgium();

  // Computed
  const isVlaamseGemeenteOrEmptyComputed = computed(() => {
    if (isBelgium() && !!state.gemeenten.value?.length && state.gemeente.value) {
      return crabApiService.vlaamseGemeenten.some((g) => g.niscode === (state.gemeente.value as IGemeente)?.niscode);
    }
    return !state.gemeente.value;
  });

  // Create builders - helpers to build address fields based on current state
  const builders = createAdresBuilders(state);

  // Build address computed
  const adres = computed(() => ({
    land: builders.buildLandValue(),
    gewest: isBelgiumOrEmpty() && !props.config?.gewest?.hidden ? builders.buildGewestValue() : undefined,
    provincie: isBelgiumOrEmpty() && !props.config?.provincie?.hidden ? builders.buildProvincieValue() : undefined,
    gemeente: builders.buildGemeenteValue(),
    postcode: !props.config?.postcode?.hidden ? builders.buildPostcodeValue() : undefined,
    straat: builders.buildStraatValue(),
    adres: builders.buildAdresValue(),
  }));

  // Create API helpers
  const apiHelpers = createApiHelpers(state, crabApiService, isBelgium);

  // Create initializers - functions to initialize reference data
  const initializers = createInitializers(state, props, crabApiService, {
    getGemeentenByGewest: apiHelpers.getGemeentenByGewest,
    getProvinciesByGewest: apiHelpers.getProvinciesByGewest,
    handleApiError: apiHelpers.handleApiError,
    isBelgium,
    isBelgiumOrEmpty,
  });

  // Setup watchers - watch for changes in state and props to trigger actions and rebuild data
  setupWatchers(
    state,
    props,
    emit,
    {
      resetDependentFields: apiHelpers.resetDependentFields,
      resetFreeTextState: apiHelpers.resetFreeTextState,
      isBelgium,
      isBelgiumOrEmpty,
    },
    initializers,
    adres
  );

  return {
    // State
    isLoading: state.isLoading,
    postcodeIsFreeText: state.postcodeIsFreeText,
    straatIsFreeText: state.straatIsFreeText,
    huisnummerIsFreeText: state.huisnummerIsFreeText,
    busnummerIsFreeText: state.busnummerIsFreeText,

    // Form values
    land: state.land,
    gewest: state.gewest,
    provincie: state.provincie,
    gemeente: state.gemeente,
    postcode: state.postcode,
    straat: state.straat,
    huisnummer: state.huisnummer,
    busnummer: state.busnummer,

    // Reference data
    landen: state.landen,
    gewesten: state.gewesten,
    provincies: state.provincies,
    gemeenten: state.gemeenten,
    postinfo: state.postinfo,
    straten: state.straten,
    huisnummers: state.huisnummers,
    busnummers: state.busnummers,

    // Computed
    isBelgiumOrEmpty: computed(isBelgiumOrEmpty),
    isBelgium: computed(isBelgium),
    isVlaamseGemeenteOrEmpty: isVlaamseGemeenteOrEmptyComputed,
    adres,

    // Methods
    performAutocompleteSearchHuisnummers: apiHelpers.performAutocompleteSearchHuisnummers,
    performAutocompleteSearchBusnummers: apiHelpers.performAutocompleteSearchBusnummers,
    initializeData: initializers.initializeData,
  };
};
