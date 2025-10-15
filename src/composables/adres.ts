import { AxiosError } from 'axios';
import { cloneDeep, pick, sortBy, uniqBy } from 'lodash';
import { computed, nextTick, ref, watch } from 'vue';
import { Niscode } from '@models/niscode.enum';
import { CrabApiService } from '@services/crab-api.service';
import { removeEmptyValues } from '@utils/object';
import type { IAdresProps } from '@models/adres';
import type { IAutocompleteOption } from '@models/autocomplete';
import type { IAdres, IGemeente, IGewest, ILand, ILocatieAdres, IPostinfo, IProvincie, IStraat } from '@models/locatie';

export function useAdresLogic(props: IAdresProps, emit: (event: 'update:adres', ...args: unknown[]) => void) {
  // State
  const isLoading = ref(false);
  const isInitializing = ref(false);
  const postcodeFreeText = ref(false);
  const straatFreeText = ref(false);
  const huisnummerFreeText = ref(false);
  const busnummerFreeText = ref(false);

  // Form values
  const land = ref<string | ILand>('');
  const gewest = ref<string | IGewest>();
  const provincie = ref<string | IProvincie>();
  const gemeente = ref<string | IGemeente>();
  const postcode = ref<string | IPostinfo>();
  const straat = ref<string | IStraat>();
  const huisnummer = ref<string | IAdres>();
  const busnummer = ref<string | IAdres>();

  // Reference data
  let crabApiService: CrabApiService;
  const staticLanden: ILand[] = [
    { code: 'BE', naam: 'België' },
    { code: 'DE', naam: 'Duitsland' },
    { code: 'FR', naam: 'Frankrijk' },
    { code: 'GB', naam: 'Groot-Brittanië' },
    { code: 'NL', naam: 'Nederland' },
    { code: 'LU', naam: 'Luxemburg' },
    { code: 'divider', naam: '─────────────────────────' },
  ];
  const apiLanden = ref<ILand[]>([]);
  const landen = computed<ILand[]>(() => [...staticLanden, ...apiLanden.value]);
  const gewesten = ref<IGewest[]>([]);
  const provincies = ref<IProvincie[]>([]);
  const gemeenten = ref<IGemeente[]>([]);
  const postinfo = ref<IPostinfo[]>([]);
  const straten = ref<IStraat[]>([]);
  const huisnummers = ref<IAdres[]>([]);
  const busnummers = ref<IAdres[]>([]);

  // Type guards
  const isStringValue = <T>(value: string | T | undefined): value is string => {
    return typeof value === 'string';
  };

  // Computed
  const isBelgiumOrEmpty = computed(() => {
    return !land.value || (land.value as ILand)?.code === 'BE' || (land.value as ILand)?.code === '';
  });

  const isBelgium = computed(() => (land.value as ILand)?.code === 'BE');

  const isVlaamseGemeenteOrEmpty = computed(() => {
    if (isBelgium.value && gemeente.value && !!gemeenten.value.length) {
      return crabApiService.vlaamseGemeenten.some(
        (g) => g.niscode === (gemeente.value as unknown as IGemeente).niscode
      );
    }
    return !gemeente.value;
  });

  const hasInitialData = computed(() => !!props.adres);

  // Helper functions for building adres parts
  const buildLandValue = (): ILocatieAdres['land'] => {
    if (!land.value) return {};
    return {
      code: (land.value as ILand).code,
      naam: (land.value as ILand).naam,
    };
  };

  const buildGewestValue = (): ILocatieAdres['gewest'] => {
    if (!gewest.value) return {};
    return {
      naam: (gewest.value as IGewest).naam,
      niscode: (gewest.value as IGewest).niscode,
    };
  };

  const buildProvincieValue = (): ILocatieAdres['provincie'] => {
    if (!provincie.value) return {};
    return {
      naam: (provincie.value as IProvincie).naam,
      niscode: (provincie.value as IProvincie).niscode,
    };
  };

  const buildGemeenteValue = (): ILocatieAdres['gemeente'] => {
    if (!gemeente.value) return {};
    if (isStringValue(gemeente.value)) {
      return { naam: gemeente.value };
    }
    return {
      naam: gemeente.value.naam,
      niscode: gemeente.value.niscode,
    };
  };

  const buildPostcodeValue = (): ILocatieAdres['postcode'] => {
    if (!postcode.value) return {};
    if (isStringValue(postcode.value)) {
      return { nummer: postcode.value };
    }
    return {
      uri: postcode.value.uri,
      nummer: postcode.value.postcode,
    };
  };

  const buildStraatValue = (): ILocatieAdres['straat'] => {
    if (!straat.value) return {};
    if (isStringValue(straat.value)) {
      return { naam: straat.value };
    }
    return {
      naam: straat.value.naam,
      id: straat.value.id,
      uri: straat.value.uri,
    };
  };

  const buildAdresValue = (): ILocatieAdres['adres'] => {
    let adresValue: ILocatieAdres['adres'] = {};

    if (huisnummer.value) {
      if (isStringValue(huisnummer.value)) {
        adresValue = { huisnummer: huisnummer.value };
      } else {
        adresValue = pick(huisnummer.value, ['id', 'uri', 'huisnummer']);
      }
    }

    if (busnummer.value) {
      if (isStringValue(busnummer.value)) {
        adresValue = { ...adresValue, busnummer: busnummer.value };
      } else {
        adresValue = {
          ...adresValue,
          busnummer: busnummer.value.busnummer,
          ...(!!busnummer.value.id && { id: busnummer.value.id }),
          ...(!!busnummer.value.uri && { uri: busnummer.value.uri }),
        };
      }
    }

    return adresValue;
  };

  const adres = computed<ILocatieAdres>(() => ({
    land: buildLandValue(),
    gewest: isBelgiumOrEmpty.value && !props.config?.gewest?.hidden ? buildGewestValue() : undefined,
    provincie: isBelgiumOrEmpty.value && !props.config?.provincie?.hidden ? buildProvincieValue() : undefined,
    gemeente: buildGemeenteValue(),
    postcode: !props.config?.postcode?.hidden ? buildPostcodeValue() : undefined,
    straat: buildStraatValue(),
    adres: buildAdresValue(),
  }));

  // Helper functions
  const resetFreeTextState = () => (straatFreeText.value = false);

  const resetDependentFields = (
    level: 'gewest' | 'provincie' | 'gemeente' | 'straat' | 'huisnummer',
    skipDuringInit = false
  ) => {
    if (isInitializing.value && skipDuringInit) return;

    const resetMap = {
      gewest: () => {
        provincie.value = undefined;
        gemeente.value = undefined;
        postcode.value = undefined;
        straat.value = undefined;
        huisnummer.value = undefined;
        busnummer.value = undefined;
      },
      provincie: () => {
        gemeente.value = undefined;
        postcode.value = undefined;
        straat.value = undefined;
        huisnummer.value = undefined;
        busnummer.value = undefined;
      },
      gemeente: () => {
        postcode.value = undefined;
        straat.value = undefined;
        huisnummer.value = undefined;
        busnummer.value = undefined;
      },
      straat: () => {
        huisnummer.value = undefined;
        busnummer.value = undefined;
      },
      huisnummer: () => {
        busnummer.value = undefined;
      },
    };
    resetMap[level]();
  };

  const getGemeentenByGewest = async (niscode: string): Promise<IGemeente[]> => {
    switch (niscode) {
      case Niscode.VlaamsGewest:
        return crabApiService.vlaamseGemeenten;
      case Niscode.WaalsGewest:
        return crabApiService.waalseGemeenten;
      case Niscode.BrusselsHoofdstedelijkGewest:
        return crabApiService.brusselseGemeenten;
      default:
        return await crabApiService.getGemeenten();
    }
  };

  const getProvinciesByGewest = (niscode: string): IProvincie[] => {
    switch (niscode) {
      case Niscode.VlaamsGewest:
        return crabApiService.vlaamseProvincies;
      case Niscode.WaalsGewest:
        return crabApiService.waalseProvincies;
      case Niscode.BrusselsHoofdstedelijkGewest:
        return [];
      default:
        return [];
    }
  };

  const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError && error?.response?.status === 404) {
      if (!isVlaamseGemeenteOrEmpty.value) {
        postcodeFreeText.value = true;
        straatFreeText.value = true;
        huisnummerFreeText.value = true;
        busnummerFreeText.value = true;
      }
      return true;
    }
    return false;
  };

  // Sequential initialization functions
  const initializeLandData = async () => {
    if (!isBelgium.value) return;

    const promises: Promise<unknown>[] = [];

    if (!props.config?.gewest?.hidden) {
      promises.push(crabApiService.getGewesten().then((data) => (gewesten.value = data)));
    }

    if (!props.config?.provincie?.hidden) {
      promises.push(crabApiService.getProvincies().then((data) => (provincies.value = data)));
    }

    promises.push(crabApiService.getGemeenten().then((data) => (gemeenten.value = data)));

    await Promise.all(promises);
  };

  const initializeGewestData = async () => {
    if (!gewest.value || !isBelgiumOrEmpty.value || props.config?.gewest?.hidden) return;

    const niscode = (gewest.value as IGewest).niscode;

    if (!props.config?.provincie?.hidden) {
      provincies.value = getProvinciesByGewest(niscode);
    }

    gemeenten.value = await getGemeentenByGewest(niscode);
  };

  const initializeProvincieData = async () => {
    if (!provincie.value || !gewest.value || props.config?.provincie?.hidden) return;

    const currentGewest = gewest.value as IGewest;
    gemeenten.value = await getGemeentenByGewest(currentGewest.niscode);

    gemeenten.value = gemeenten.value.filter((g) => g.provincie.niscode === (provincie.value as IProvincie).niscode);
  };

  const initializeGemeenteData = async () => {
    if (!gemeente.value || !isBelgiumOrEmpty.value) return;

    const promises: Promise<unknown>[] = [];

    if (!props.config?.postcode?.hidden) {
      promises.push(
        crabApiService.getPostinfo((gemeente.value as IGemeente).naam).then((data) => (postinfo.value = data))
      );
    }

    promises.push(
      crabApiService
        .getStraten((gemeente.value as IGemeente).niscode)
        .then((data) => (straten.value = sortBy(data, 'naam')))
    );

    try {
      await Promise.all(promises);
    } catch (error: unknown) {
      if (handleApiError(error)) {
        straten.value = [];
      }
    }
  };

  const initializeStraatData = async () => {
    if (!straat.value || !isBelgiumOrEmpty.value || straatFreeText.value) return;

    try {
      const adressen = await crabApiService.getAdressen((straat.value as IStraat).id);
      huisnummers.value = uniqBy(
        sortBy(adressen, (s) => parseInt(s.huisnummer, 0)),
        'huisnummer'
      );
      huisnummerFreeText.value = !huisnummers.value.length;
    } catch (error: unknown) {
      if (handleApiError(error)) {
        huisnummers.value = [];
        busnummers.value = [];
        huisnummerFreeText.value = true;
        busnummerFreeText.value = true;
      }
    }
  };

  const initializeHuisnummerData = async () => {
    if (
      !adres.value.straat?.id ||
      !huisnummer.value ||
      !isBelgiumOrEmpty.value ||
      huisnummerFreeText.value ||
      props.config?.busnummer?.hidden
    )
      return;

    const adressen = await crabApiService.getAdressen(
      adres.value.straat.id as string,
      (huisnummer.value as IAdres).huisnummer
    );

    busnummers.value = sortBy(adressen, 'busnummer').filter((v) => !!v.busnummer);

    if (busnummers.value.length === 1) {
      busnummer.value = (busnummers.value.at(0) as IAdres)?.busnummer;
    }

    if (isInitializing.value || busnummers.value.length === 0) {
      busnummerFreeText.value = busnummers.value.length === 0;
    }
  };

  // Initialization configuration
  interface InitializationStep {
    condition: () => boolean;
    action: () => Promise<void>;
    name: string;
  }

  const initializationSteps: InitializationStep[] = [
    {
      name: 'land',
      condition: () => isBelgium.value,
      action: initializeLandData,
    },
    {
      name: 'gewest',
      condition: () => !!gewest.value && !props.config?.gewest?.hidden,
      action: initializeGewestData,
    },
    {
      name: 'provincie',
      condition: () => !!provincie.value && !props.config?.provincie?.hidden,
      action: initializeProvincieData,
    },
    {
      name: 'gemeente',
      condition: () => !!gemeente.value,
      action: initializeGemeenteData,
    },
    {
      name: 'straat',
      condition: () => !!straat.value,
      action: initializeStraatData,
    },
    {
      name: 'huisnummer',
      condition: () => !!huisnummer.value && !props.config?.busnummer?.hidden,
      action: initializeHuisnummerData,
    },
  ];

  const initializeSequentially = async () => {
    isInitializing.value = true;

    try {
      for (const step of initializationSteps) {
        if (step.condition()) {
          await step.action();
          await nextTick();
        }
      }
    } finally {
      isInitializing.value = false;
      isLoading.value = false;
    }
  };

  // Methods
  const performAutocompleteSearchHuisnummers = (searchTerm: string): Promise<IAutocompleteOption[]> => {
    return Promise.resolve(
      huisnummers.value
        .filter((h) => h.huisnummer.includes(searchTerm))
        .map((h) => ({
          title: h.huisnummer,
          value: h,
        }))
    );
  };

  const performAutocompleteSearchBusnummers = (searchTerm: string): Promise<IAutocompleteOption[]> => {
    return Promise.resolve(
      uniqBy(busnummers.value, 'busnummer')
        .filter((b) => b.busnummer.includes(searchTerm))
        .map((b) => ({
          title: b.busnummer,
          value: b,
        }))
    );
  };

  const initializeData = async () => {
    crabApiService = new CrabApiService(props.api || '');
    apiLanden.value = await crabApiService.getLanden();

    if (props.adres) {
      const adresData = cloneDeep(props.adres);
      removeEmptyValues(adresData);

      isInitializing.value = true;

      if (props.countryId) {
        land.value = { code: props.countryId } as ILand;
      } else {
        land.value = adresData.land as ILand;
      }

      if (isBelgium.value) {
        if (adresData.gewest) gewest.value = adresData.gewest as IGewest;
        if (adresData.provincie) provincie.value = adresData.provincie as IProvincie;
        if (adresData.gemeente) gemeente.value = adresData.gemeente as IGemeente;
        if (adresData.postcode)
          postcode.value = { postcode: adresData.postcode.nummer, uri: adresData.postcode.uri } as IPostinfo;
        if (adresData.straat) straat.value = adresData.straat as IStraat;
        if (adresData.adres) {
          huisnummer.value = adresData.adres as IAdres;
          busnummer.value = adresData.adres as IAdres;
        }

        await nextTick();
        await initializeSequentially();
      } else {
        gemeente.value = adresData.gemeente?.naam || '';
        postcode.value = adresData.postcode?.nummer || '';
        straat.value = adresData.straat?.naam || '';
        huisnummer.value = adresData.adres?.huisnummer || '';
        busnummer.value = adresData.adres?.busnummer || '';
        isInitializing.value = false;
      }
    } else {
      if (props.countryId) {
        land.value = { code: props.countryId } as ILand;
      }
    }
  };

  // Watcher factory
  interface WatcherConfig<T> {
    source: () => T;
    resetLevel?: 'gewest' | 'provincie' | 'gemeente' | 'straat' | 'huisnummer';
    initializeAction?: () => Promise<void>;
    skipWhen?: () => boolean;
    onValueChange?: (newValue: T, oldValue: T | undefined) => void;
    shouldInitialize?: (newValue: T) => boolean;
  }

  const createFieldWatcher = <T>(config: WatcherConfig<T>) => {
    watch(config.source, async (newValue, oldValue) => {
      if (isInitializing.value || config.skipWhen?.()) return;

      if (oldValue && config.resetLevel) {
        resetDependentFields(config.resetLevel);
      }

      config.onValueChange?.(newValue, oldValue);

      const shouldInit = config.shouldInitialize ? config.shouldInitialize(newValue) : !!newValue;

      if (config.initializeAction && shouldInit) {
        resetFreeTextState();
        await config.initializeAction();
      } else {
        isLoading.value = false;
      }
    });
  };

  // Watchers
  watch(adres, () => {
    if (!isInitializing.value) {
      emit('update:adres', adres.value);
    }
  });

  watch(
    () => props.countryId,
    (current) => {
      if (!current || isInitializing.value) return;
      land.value = { code: current };
    }
  );

  createFieldWatcher({
    source: () => land.value,
    resetLevel: 'gewest',
    initializeAction: async () => {
      if (isBelgium.value) {
        await initializeLandData();
      }
    },
  });

  createFieldWatcher({
    source: () => gewest.value,
    resetLevel: 'provincie',
    skipWhen: () => props.config?.gewest?.hidden || false,
    shouldInitialize: (value) => isBelgiumOrEmpty.value && !!value,
    initializeAction: initializeGewestData,
  });

  createFieldWatcher({
    source: () => provincie.value,
    resetLevel: 'gemeente',
    skipWhen: () => props.config?.provincie?.hidden || false,
    shouldInitialize: (value) => isBelgiumOrEmpty.value && !!value,
    initializeAction: initializeProvincieData,
  });

  createFieldWatcher({
    source: () => gemeente.value,
    resetLevel: 'gemeente',
    shouldInitialize: (value) => isBelgiumOrEmpty.value && !!value,
    initializeAction: initializeGemeenteData,
  });

  createFieldWatcher({
    source: () => straat.value,
    resetLevel: 'straat',
    shouldInitialize: (value) => isBelgiumOrEmpty.value && !!value && !straatFreeText.value,
    initializeAction: initializeStraatData,
  });

  watch(huisnummer, async (selectedHuisnummer, oldValue) => {
    if (isInitializing.value) return;

    const hasChanged =
      oldValue &&
      (selectedHuisnummer !== (oldValue as IAdres)?.huisnummer ||
        (typeof oldValue === 'string' && selectedHuisnummer !== oldValue));

    if (hasChanged) {
      resetDependentFields('huisnummer');
      if (!props.config?.busnummer?.hidden) {
        busnummerFreeText.value = false;
      }
    }

    const shouldFetchBusnummers =
      adres.value.straat?.id &&
      isBelgiumOrEmpty.value &&
      selectedHuisnummer &&
      !huisnummerFreeText.value &&
      !props.config?.busnummer?.hidden;

    if (shouldFetchBusnummers) {
      await initializeHuisnummerData();
    }
  });

  // Free text watchers
  watch(postcodeFreeText, (newVal, oldVal) => {
    if (isInitializing.value || newVal === oldVal || props.config?.postcode?.hidden) return;
    postcode.value = '';
  });

  watch(straatFreeText, (newVal, oldVal) => {
    if (isInitializing.value || newVal === oldVal) return;
    straat.value = '';
  });

  watch(huisnummerFreeText, (newVal, oldVal) => {
    if (isInitializing.value || newVal === oldVal) return;
    const currentValue = huisnummer.value;
    huisnummer.value = hasInitialData.value
      ? (currentValue as IAdres)?.huisnummer || currentValue || ''
      : (currentValue as IAdres)?.huisnummer || '';
  });

  watch(busnummerFreeText, (newVal, oldVal) => {
    if (isInitializing.value || newVal === oldVal || props.config?.busnummer?.hidden) return;
    const currentValue = busnummer.value;
    busnummer.value = hasInitialData.value
      ? (currentValue as IAdres)?.busnummer || currentValue || ''
      : (currentValue as IAdres)?.busnummer || '';
  });

  return {
    // State
    isLoading,
    postcodeFreeText,
    straatFreeText,
    huisnummerFreeText,
    busnummerFreeText,

    // Form values
    land,
    gewest,
    provincie,
    gemeente,
    postcode,
    straat,
    huisnummer,
    busnummer,

    // Reference data
    landen,
    gewesten,
    provincies,
    gemeenten,
    postinfo,
    straten,
    huisnummers,
    busnummers,

    // Computed
    isBelgiumOrEmpty,
    isBelgium,
    isVlaamseGemeenteOrEmpty,
    adres,

    // Methods
    performAutocompleteSearchHuisnummers,
    performAutocompleteSearchBusnummers,
    initializeData,
  };
}
