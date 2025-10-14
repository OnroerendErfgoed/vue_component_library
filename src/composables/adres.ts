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

  const adres = computed<ILocatieAdres>(() => {
    let landValue: ILocatieAdres['land'];
    let gewestValue: ILocatieAdres['gewest'];
    let provincieValue: ILocatieAdres['provincie'];
    let gemeenteValue: ILocatieAdres['gemeente'];
    let postcodeValue: ILocatieAdres['postcode'];
    let straatValue: ILocatieAdres['straat'];
    let adresValue: ILocatieAdres['adres'];

    if (!land.value) {
      landValue = {};
    } else {
      landValue = {
        code: (land.value as ILand).code,
        naam: (land.value as ILand).naam,
      };
    }

    if (!gewest.value) {
      gewestValue = {};
    } else {
      gewestValue = {
        naam: (gewest.value as IGewest).naam,
        niscode: (gewest.value as IGewest).niscode,
      };
    }

    if (!provincie.value) {
      provincieValue = {};
    } else {
      provincieValue = {
        naam: (provincie.value as IProvincie).naam,
        niscode: (provincie.value as IProvincie).niscode,
      };
    }

    if (!gemeente.value) {
      gemeenteValue = {};
    } else if (typeof gemeente.value === 'string') {
      gemeenteValue = { naam: gemeente.value as string };
    } else {
      gemeenteValue = {
        naam: (gemeente.value as IGemeente).naam,
        niscode: (gemeente.value as IGemeente).niscode,
      };
    }

    if (!postcode.value) {
      postcodeValue = {};
    } else if (typeof postcode.value === 'string') {
      postcodeValue = { nummer: postcode.value as string };
    } else {
      postcodeValue = {
        uri: (postcode.value as IPostinfo).uri,
        nummer: (postcode.value as IPostinfo).postcode,
      };
    }

    if (!straat.value) {
      straatValue = {};
    } else if (typeof straat.value === 'string') {
      straatValue = { naam: straat.value as string };
    } else {
      straatValue = {
        naam: (straat.value as IStraat).naam,
        id: (straat.value as IStraat).id,
        uri: (straat.value as IStraat).uri,
      };
    }

    if (!huisnummer.value) {
      adresValue = {};
    } else if (typeof huisnummer.value === 'string') {
      adresValue = { huisnummer: huisnummer.value };
    } else {
      adresValue = pick(huisnummer.value, ['id', 'uri', 'huisnummer']);
    }

    if (busnummer.value) {
      if (typeof busnummer.value === 'string') {
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
    return {
      land: landValue,
      gewest: isBelgiumOrEmpty.value && !props.config?.gewest?.hidden ? gewestValue : undefined,
      provincie: isBelgiumOrEmpty.value && !props.config?.provincie?.hidden ? provincieValue : undefined,
      gemeente: gemeenteValue,
      postcode: !props.config?.postcode?.hidden ? postcodeValue : undefined,
      straat: straatValue,
      adres: adresValue,
    };
  });

  // Helper functions
  const resetFreeTextState = () => (straatFreeText.value = false);

  const resetDependentFields = (
    level: 'gewest' | 'provincie' | 'gemeente' | 'straat' | 'huisnummer',
    skipDuringInit = false
  ) => {
    // Don't reset fields during initialization unless explicitly requested
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
      return true; // Error handled
    }
    return false; // Error not handled
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
    if (!gewest.value || !isBelgiumOrEmpty.value) return;

    const niscode = (gewest.value as IGewest).niscode;
    provincies.value = getProvinciesByGewest(niscode);
    gemeenten.value = await getGemeentenByGewest(niscode);
  };

  const initializeProvincieData = async () => {
    if (!provincie.value || !gewest.value) return;

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

    // Only set busnummerFreeText during initialization or if explicitly needed
    if (isInitializing.value || busnummers.value.length === 0) {
      busnummerFreeText.value = busnummers.value.length === 0;
    }
  };

  // Sequential initialization chain
  const initializeSequentially = async () => {
    isInitializing.value = true;

    try {
      // Step 1: Initialize based on land
      await initializeLandData();
      await nextTick();

      // Step 2: Initialize based on gewest
      await initializeGewestData();
      await nextTick();

      // Step 3: Initialize based on provincie
      await initializeProvincieData();
      await nextTick();

      // Step 4: Initialize based on gemeente
      await initializeGemeenteData();
      await nextTick();

      // Step 5: Initialize based on straat
      await initializeStraatData();
      await nextTick();

      // Step 6: Initialize based on huisnummer
      await initializeHuisnummerData();
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

  const hasInitialData = computed(() => !!props.adres);

  const initializeData = async () => {
    crabApiService = new CrabApiService(props.api || '');
    apiLanden.value = await crabApiService.getLanden();

    if (props.adres) {
      const adresData = cloneDeep(props.adres);
      removeEmptyValues(adresData);

      isInitializing.value = true;

      // Set all values first without triggering watchers
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

        // Now initialize data sequentially
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

  // Watchers - Now with proper guards
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

  watch(land, async (selectedLand, oldValue) => {
    if (isInitializing.value) return;

    if (oldValue) {
      resetDependentFields('gewest');
    }

    if (isBelgium.value) {
      resetFreeTextState();
      await initializeLandData();
    } else {
      isLoading.value = false;
    }
  });

  watch(gewest, async (selectedGewest, oldValue) => {
    if (isInitializing.value) return;

    if (oldValue) {
      resetDependentFields('provincie');
    }

    if (isBelgiumOrEmpty.value && !props.config?.gewest?.hidden && selectedGewest) {
      resetFreeTextState();
      await initializeGewestData();
    } else {
      isLoading.value = false;
    }
  });

  watch(provincie, async (selectedProvincie, oldValue) => {
    if (isInitializing.value) return;

    if (oldValue) {
      resetDependentFields('gemeente');
    }

    if (isBelgiumOrEmpty.value && !props.config?.provincie?.hidden && selectedProvincie) {
      resetFreeTextState();
      await initializeProvincieData();
    } else {
      isLoading.value = false;
    }
  });

  watch(gemeente, async (selectedGemeente, oldValue) => {
    if (isInitializing.value) return;

    if (oldValue) {
      resetDependentFields('gemeente');
    }

    if (isBelgiumOrEmpty.value && selectedGemeente) {
      resetFreeTextState();
      await initializeGemeenteData();
    } else {
      isLoading.value = false;
    }
  });

  watch(straat, async (selectedStraat, oldValue) => {
    if (isInitializing.value) return;

    if (oldValue) {
      resetDependentFields('straat');
    }

    if (isBelgiumOrEmpty.value && selectedStraat && !straatFreeText.value) {
      resetFreeTextState();
      await initializeStraatData();
    }
  });

  watch(huisnummer, async (selectedHuisnummer, oldValue) => {
    if (isInitializing.value) return;

    const hasChanged =
      oldValue &&
      (selectedHuisnummer !== (oldValue as IAdres)?.huisnummer ||
        (typeof oldValue === 'string' && selectedHuisnummer !== oldValue));

    if (hasChanged) {
      resetDependentFields('huisnummer');
      // Reset busnummerFreeText when huisnummer changes (user interaction)
      busnummerFreeText.value = false;
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

  // Free text watchers - Add guards to prevent infinite loops
  watch(postcodeFreeText, (newVal, oldVal) => {
    if (isInitializing.value || newVal === oldVal) return;
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
    if (isInitializing.value || newVal === oldVal) return;
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
