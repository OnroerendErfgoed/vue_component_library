import { ResetLevel } from '@composables/adres';
import { Ref, watch } from 'vue';
import { IAdresProps } from '@models/adres';
import type { AdresState } from './state';
import type { IAdres, ILocatieAdres } from '@models/locatie';

interface WatcherConfig<T> {
  // Property to watch
  source: () => T;
  resetLevel?: ResetLevel;
  initializeAction?: () => Promise<void>;
  skipWhen?: () => boolean;
  onValueChange?: (newValue: T, oldValue: T | undefined) => void;
  shouldInitialize?: (newValue: T) => boolean;
}

/*
 * Create field watcher
 * Generic function to create a watcher for a specific field in the address state
 * @param state - The address state
 * @param config - Configuration for the watcher
 * @param resetFreeTextState - Function to reset free text state flags
 */
export function createFieldWatcher<T>(state: AdresState, config: WatcherConfig<T>, resetFreeTextState: () => void) {
  watch(config.source, async (newValue, oldValue) => {
    if (state.isInitializing.value || config.skipWhen?.()) return;

    if (oldValue && config.resetLevel) {
      // This would need the resetDependentFields function passed in
      config.onValueChange?.(newValue, oldValue);
    }

    const shouldInit = config.shouldInitialize ? config.shouldInitialize(newValue) : !!newValue;

    if (config.initializeAction && shouldInit) {
      resetFreeTextState();
      await config.initializeAction();
    } else {
      state.isLoading.value = false;
    }
  });
}

/*
 * Setup watchers
 * Watch for changes in state and props to trigger actions and rebuild data
 * @param state - The address state
 * @param props - The address component props
 * @param emit - The emit function to emit events
 * @param helpers - Helper functions for resetting fields and checking country
 * @param initializers - Functions to initialize reference data
 * @param adresComputed - The computed address value
 */
export function setupWatchers(
  state: AdresState,
  props: IAdresProps,
  emit: (event: 'update:adres', ...args: unknown[]) => void,
  helpers: {
    resetDependentFields: (level: ResetLevel) => void;
    resetFreeTextState: () => void;
    isBelgium: () => boolean;
    isBelgiumOrEmpty: () => boolean;
  },
  initializers: {
    initializeLandData: () => Promise<void>;
    initializeGewestData: () => Promise<void>;
    initializeProvincieData: () => Promise<void>;
    initializeGemeenteData: () => Promise<void>;
    initializeStraatData: () => Promise<void>;
    initializeHuisnummerData: (adresValue: ILocatieAdres) => Promise<void>;
  },
  adresComputed: Ref<ILocatieAdres>
) {
  // Emit watcher
  watch(adresComputed, () => {
    if (!state.isInitializing.value) {
      emit('update:adres', adresComputed.value);
    }
  });

  // Country ID watcher
  watch(
    () => props.countryId,
    (current) => {
      if (!current || state.isInitializing.value) return;
      state.land.value = { code: current };
    }
  );

  // Land watcher
  createFieldWatcher(
    state,
    {
      source: () => state.land.value,
      resetLevel: 'land',
      initializeAction: async () => {
        if (helpers.isBelgium()) {
          await initializers.initializeLandData();
        }
      },
      onValueChange: (_, oldValue) => {
        if (oldValue) {
          helpers.resetDependentFields('land');
        }
      },
    },
    helpers.resetFreeTextState
  );

  // Gewest watcher
  createFieldWatcher(
    state,
    {
      source: () => state.gewest.value,
      resetLevel: 'gewest',
      skipWhen: () => props.config?.gewest?.hidden || false,
      shouldInitialize: (value) => helpers.isBelgiumOrEmpty() && !!value,
      initializeAction: initializers.initializeGewestData,
      onValueChange: (_, oldValue) => {
        if (oldValue) {
          helpers.resetDependentFields('gewest');
        }
      },
    },
    helpers.resetFreeTextState
  );

  // Provincie watcher
  createFieldWatcher(
    state,
    {
      source: () => state.provincie.value,
      resetLevel: 'provincie',
      skipWhen: () => props.config?.provincie?.hidden || false,
      shouldInitialize: (value) => helpers.isBelgiumOrEmpty() && !!value,
      initializeAction: initializers.initializeProvincieData,
      onValueChange: (_, oldValue) => {
        if (oldValue) {
          helpers.resetDependentFields('provincie');
        }
      },
    },
    helpers.resetFreeTextState
  );

  // Gemeente watcher
  createFieldWatcher(
    state,
    {
      source: () => state.gemeente.value,
      resetLevel: 'gemeente',
      shouldInitialize: (value) => helpers.isBelgiumOrEmpty() && !!value,
      initializeAction: initializers.initializeGemeenteData,
      onValueChange: (_, oldValue) => {
        if (oldValue) {
          helpers.resetDependentFields('gemeente');
        }
      },
    },
    helpers.resetFreeTextState
  );

  // Straat watcher
  createFieldWatcher(
    state,
    {
      source: () => state.straat.value,
      resetLevel: 'straat',
      shouldInitialize: (value) => helpers.isBelgiumOrEmpty() && !!value && !state.straatIsFreeText.value,
      initializeAction: initializers.initializeStraatData,
      onValueChange: (_, oldValue) => {
        if (oldValue) {
          helpers.resetDependentFields('straat');
        }
      },
    },
    helpers.resetFreeTextState
  );

  // Huisnummer watcher (special case)
  watch(state.huisnummer, async (selectedHuisnummer, oldValue) => {
    if (state.isInitializing.value) return;

    const hasChanged =
      oldValue &&
      (selectedHuisnummer !== (oldValue as IAdres)?.huisnummer ||
        (typeof oldValue === 'string' && selectedHuisnummer !== oldValue));

    if (hasChanged) {
      helpers.resetDependentFields('huisnummer');
      if (!props.config?.busnummer?.hidden) {
        state.busnummerIsFreeText.value = false;
      }
    }

    const shouldFetchBusnummers =
      adresComputed.value.straat?.id &&
      helpers.isBelgiumOrEmpty() &&
      selectedHuisnummer &&
      !state.huisnummerIsFreeText.value &&
      !props.config?.busnummer?.hidden;

    if (shouldFetchBusnummers) {
      await initializers.initializeHuisnummerData(adresComputed.value);
    }
  });

  // Free text watchers
  watch(state.postcodeIsFreeText, (newVal, oldVal) => {
    if (state.isInitializing.value || newVal === oldVal || props.config?.postcode?.hidden) return;
    state.postcode.value = '';
  });

  watch(state.straatIsFreeText, (newVal, oldVal) => {
    if (state.isInitializing.value || newVal === oldVal) return;
    state.straat.value = '';
  });

  watch(state.huisnummerIsFreeText, (newVal, oldVal) => {
    if (state.isInitializing.value || newVal === oldVal) return;
    const currentValue = state.huisnummer.value;
    const hasInitialData = !!props.adres;
    state.huisnummer.value = hasInitialData
      ? (currentValue as IAdres)?.huisnummer || currentValue || ''
      : (currentValue as IAdres)?.huisnummer || '';
  });

  watch(state.busnummerIsFreeText, (newVal, oldVal) => {
    if (state.isInitializing.value || newVal === oldVal || props.config?.busnummer?.hidden) return;
    const currentValue = state.busnummer.value;
    const hasInitialData = !!props.adres;
    state.busnummer.value = hasInitialData
      ? (currentValue as IAdres)?.busnummer || currentValue || ''
      : (currentValue as IAdres)?.busnummer || '';
  });
}
