import { Ref, watch } from 'vue';
import { IAdresConfig } from '@models/adres';
import type { AdresState } from './state';
import type { ResetLevel, WatcherConfig } from './types';
import type { IAdres, ILocatieAdres } from '@models/locatie';

export function createFieldWatcher<T>(state: AdresState, config: WatcherConfig<T>, resetFreeTextState: () => void) {
  watch(config.source, async (newValue, oldValue) => {
    if (state.isInitializing.value || config.skipWhen?.()) return;

    if (oldValue && config.resetLevel) {
      // This would need the resetDependentFields function passed in
      config.onValueChange?.(newValue, oldValue);
    }

    config.onValueChange?.(newValue, oldValue);

    const shouldInit = config.shouldInitialize ? config.shouldInitialize(newValue) : !!newValue;

    if (config.initializeAction && shouldInit) {
      resetFreeTextState();
      await config.initializeAction();
    } else {
      state.isLoading.value = false;
    }
  });
}

export function setupWatchers(
  state: AdresState,
  props: { countryId?: string; config?: IAdresConfig; adres?: ILocatieAdres },
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
      resetLevel: 'gewest',
      initializeAction: async () => {
        if (helpers.isBelgium()) {
          await initializers.initializeLandData();
        }
      },
      onValueChange: (newValue, oldValue) => {
        if (oldValue) {
          helpers.resetDependentFields('gewest');
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
      resetLevel: 'provincie',
      skipWhen: () => props.config?.gewest?.hidden || false,
      shouldInitialize: (value) => helpers.isBelgiumOrEmpty() && !!value,
      initializeAction: initializers.initializeGewestData,
      onValueChange: (newValue, oldValue) => {
        if (oldValue) {
          helpers.resetDependentFields('provincie');
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
      resetLevel: 'gemeente',
      skipWhen: () => props.config?.provincie?.hidden || false,
      shouldInitialize: (value) => helpers.isBelgiumOrEmpty() && !!value,
      initializeAction: initializers.initializeProvincieData,
      onValueChange: (newValue, oldValue) => {
        if (oldValue) {
          helpers.resetDependentFields('gemeente');
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
      onValueChange: (newValue, oldValue) => {
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
      shouldInitialize: (value) => helpers.isBelgiumOrEmpty() && !!value && !state.straatFreeText.value,
      initializeAction: initializers.initializeStraatData,
      onValueChange: (newValue, oldValue) => {
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
        state.busnummerFreeText.value = false;
      }
    }

    const shouldFetchBusnummers =
      adresComputed.value.straat?.id &&
      helpers.isBelgiumOrEmpty() &&
      selectedHuisnummer &&
      !state.huisnummerFreeText.value &&
      !props.config?.busnummer?.hidden;

    if (shouldFetchBusnummers) {
      await initializers.initializeHuisnummerData(adresComputed.value);
    }
  });

  // Free text watchers
  watch(state.postcodeFreeText, (newVal, oldVal) => {
    if (state.isInitializing.value || newVal === oldVal || props.config?.postcode?.hidden) return;
    state.postcode.value = '';
  });

  watch(state.straatFreeText, (newVal, oldVal) => {
    if (state.isInitializing.value || newVal === oldVal) return;
    state.straat.value = '';
  });

  watch(state.huisnummerFreeText, (newVal, oldVal) => {
    if (state.isInitializing.value || newVal === oldVal) return;
    const currentValue = state.huisnummer.value;
    const hasInitialData = !!props.adres;
    state.huisnummer.value = hasInitialData
      ? (currentValue as IAdres)?.huisnummer || currentValue || ''
      : (currentValue as IAdres)?.huisnummer || '';
  });

  watch(state.busnummerFreeText, (newVal, oldVal) => {
    if (state.isInitializing.value || newVal === oldVal || props.config?.busnummer?.hidden) return;
    const currentValue = state.busnummer.value;
    const hasInitialData = !!props.adres;
    state.busnummer.value = hasInitialData
      ? (currentValue as IAdres)?.busnummer || currentValue || ''
      : (currentValue as IAdres)?.busnummer || '';
  });
}
