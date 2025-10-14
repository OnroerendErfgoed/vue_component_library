import { AxiosError } from 'axios';
import { cloneDeep, pick, sortBy, uniqBy } from 'lodash';
import { computed, ref, watch } from 'vue';
import { Niscode } from '@models/niscode.enum';
import { CrabApiService } from '@services/crab-api.service';
import { removeEmptyValues } from '@utils/object';
import type { IAdresProps } from '@models/adres';
import type { IAutocompleteOption } from '@models/autocomplete';
import type { IAdres, IGemeente, IGewest, ILand, ILocatieAdres, IPostinfo, IProvincie, IStraat } from '@models/locatie';

export function useAdresLogic(props: IAdresProps, emit: (event: 'update:adres', ...args: unknown[]) => void) {
  // State
  const isLoading = ref(false);
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

  // Methods
  const resetFreeTextState = () => (straatFreeText.value = false);

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
      } else {
        gemeente.value = adresData.gemeente?.naam || '';
        postcode.value = adresData.postcode?.nummer || '';
        straat.value = adresData.straat?.naam || '';
        huisnummer.value = adresData.adres?.huisnummer || '';
        busnummer.value = adresData.adres?.busnummer || '';
      }
    } else {
      if (props.countryId) {
        land.value = { code: props.countryId } as ILand;
      }
    }
  };

  // Watchers
  watch(adres, () => {
    emit('update:adres', adres.value);
  });

  watch(
    () => props.countryId,
    (current) => {
      if (!current) return;
      land.value = { code: current };
    }
  );

  watch(land, async (selectedLand, oldValue) => {
    if (oldValue) {
      gewest.value = undefined;
      provincie.value = undefined;
      gemeente.value = undefined;
    }
    if (isBelgium.value) {
      resetFreeTextState();
      if (isBelgiumOrEmpty.value && !props.config?.gewest?.hidden) {
        gewesten.value = await crabApiService.getGewesten();
      }
      if (isBelgiumOrEmpty.value && !props.config?.provincie?.hidden) {
        provincies.value = await crabApiService.getProvincies();
        gemeenten.value = await crabApiService.getGemeenten();

        if ((gewest.value as IGewest)?.niscode === Niscode.VlaamsGewest) {
          provincies.value = crabApiService.vlaamseProvincies;

          if ((provincie.value as IProvincie)?.niscode) {
            console.log('has provincie', provincie.value);

            gemeenten.value = crabApiService.vlaamseGemeenten.filter(
              (g) => g.provincie.niscode === (provincie.value as IProvincie).niscode
            );
          } else {
            console.log('setting all gemeenten for vlaams gewest');

            gemeenten.value = crabApiService.vlaamseGemeenten;
          }
          console.log('[LAND] Setting provinces and municipalities for Flemish region', gemeenten.value);
        } else if ((gewest.value as IGewest)?.niscode === Niscode.WaalsGewest) {
          provincies.value = crabApiService.waalseProvincies;
          gemeenten.value = crabApiService.waalseGemeenten;
        } else if ((gewest.value as IGewest)?.niscode === Niscode.BrusselsHoofdstedelijkGewest) {
          provincies.value = [];
          gemeenten.value = crabApiService.brusselseGemeenten;
        } else {
          console.log('[LAND] Unknown gewest, fetching all provinces and municipalities');
          gemeenten.value = await crabApiService.getGemeenten();
        }
      }

      if (isBelgiumOrEmpty.value && props.config?.gewest?.hidden && props.config?.provincie?.hidden) {
        gemeenten.value = await crabApiService.getGemeenten();
      }
    } else {
      isLoading.value = false;
    }
  });

  watch(gewest, async (selectedGewest, oldValue) => {
    if (oldValue) {
      provincie.value = undefined;
      gemeente.value = undefined;
    }
    if (isBelgiumOrEmpty.value && !props.config?.gewest?.hidden) {
      if (selectedGewest) resetFreeTextState();
      switch ((selectedGewest as IGewest)?.niscode) {
        case Niscode.VlaamsGewest:
          provincies.value = crabApiService.vlaamseProvincies;
          gemeenten.value = crabApiService.vlaamseGemeenten;
          break;
        case Niscode.WaalsGewest:
          provincies.value = crabApiService.waalseProvincies;
          gemeenten.value = crabApiService.waalseGemeenten;
          break;
        case Niscode.BrusselsHoofdstedelijkGewest:
          provincies.value = [];
          gemeenten.value = crabApiService.brusselseGemeenten;
          break;
        default:
          console.log('Unknown gewest, fetching all provinces and municipalities');

          provincies.value = await crabApiService.getProvincies();
          gemeenten.value = await crabApiService.getGemeenten();
      }
    } else {
      isLoading.value = false;
    }
  });

  watch(provincie, async (selectedProvincie, oldValue) => {
    if (oldValue) {
      gemeente.value = undefined;
    }
    if (isBelgiumOrEmpty.value && !props.config?.provincie?.hidden) {
      switch ((gewest.value as IGewest)?.niscode) {
        case Niscode.VlaamsGewest:
          gemeenten.value = crabApiService.vlaamseGemeenten;
          break;
        case Niscode.WaalsGewest:
          gemeenten.value = crabApiService.waalseGemeenten;
          break;
        case Niscode.BrusselsHoofdstedelijkGewest:
          gemeenten.value = crabApiService.brusselseGemeenten;
          break;
        default:
          console.log('Unknown gewest, watch provincie fetching all municipalities');

          gemeenten.value = await crabApiService.getGemeenten();
      }
      if ((selectedProvincie as IProvincie)?.niscode) {
        resetFreeTextState();

        gemeenten.value = (await crabApiService.getGemeenten()).filter(
          (g) => g.provincie.niscode === (selectedProvincie as IProvincie).niscode
        );
        console.log('setting gemeenten for provincie', gemeenten.value);
      }
    } else {
      isLoading.value = false;
    }
  });

  watch(gemeente, async (selectedGemeente, oldValue) => {
    if (oldValue) {
      postcode.value = undefined;
      straat.value = undefined;
    }

    if (isBelgiumOrEmpty.value && selectedGemeente) {
      resetFreeTextState();

      try {
        postinfo.value = !props.config?.postcode?.hidden
          ? await crabApiService.getPostinfo((selectedGemeente as IGemeente).naam)
          : [];
        straten.value = sortBy(await crabApiService.getStraten((selectedGemeente as IGemeente).niscode), 'naam');
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          const knownError = error as AxiosError;
          if (knownError?.response?.status === 404) {
            straten.value = [];

            if (!isVlaamseGemeenteOrEmpty.value) {
              postcodeFreeText.value = true;
              straatFreeText.value = true;
              huisnummerFreeText.value = true;
              busnummerFreeText.value = true;
            }
          }
        }
      } finally {
        isLoading.value = false;
      }
    } else {
      isLoading.value = false;
    }
  });

  watch(straat, async (selectedStraat, oldValue) => {
    if (oldValue) {
      huisnummer.value = undefined;
    }

    if (isBelgiumOrEmpty.value && selectedStraat && !straatFreeText.value) {
      resetFreeTextState();

      try {
        huisnummers.value = uniqBy(
          sortBy(await crabApiService.getAdressen((selectedStraat as IStraat).id), (s) => parseInt(s.huisnummer, 0)),
          'huisnummer'
        );
        huisnummerFreeText.value = !huisnummers.value.length;
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          const knownError = error as AxiosError;
          if (knownError?.response?.status === 404) {
            huisnummers.value = [];
            busnummers.value = [];
            huisnummerFreeText.value = true;
            busnummerFreeText.value = true;
          }
        }
      }
    }
  });

  watch(huisnummer, async (selectedHuisnummer, oldValue) => {
    if (
      oldValue &&
      (selectedHuisnummer !== (oldValue as IAdres)?.huisnummer ||
        (typeof oldValue === 'string' && selectedHuisnummer !== oldValue))
    ) {
      busnummer.value = undefined;
    }

    if (
      adres.value.straat?.id &&
      isBelgiumOrEmpty.value &&
      selectedHuisnummer &&
      !huisnummerFreeText.value &&
      !props.config?.busnummer?.hidden
    ) {
      busnummers.value = sortBy(
        await crabApiService.getAdressen(adres.value.straat.id as string, (selectedHuisnummer as IAdres).huisnummer),
        'busnummer'
      ).filter((v) => !!v.busnummer);

      if (busnummers.value.length === 1) {
        busnummer.value = (busnummers.value.at(0) as IAdres)?.busnummer;
      }

      if (busnummers.value.length === 0) {
        busnummerFreeText.value = true;
      } else {
        busnummerFreeText.value = false;
      }
    }
  });

  watch(postcodeFreeText, () => (postcode.value = ''));
  watch(straatFreeText, () => (straat.value = ''));
  watch(
    huisnummerFreeText,
    () =>
      (huisnummer.value = hasInitialData.value
        ? (huisnummer.value as IAdres)?.huisnummer || huisnummer.value || ''
        : (huisnummer.value as IAdres)?.huisnummer || '')
  );
  watch(
    busnummerFreeText,
    () =>
      (busnummer.value = hasInitialData.value
        ? (busnummer.value as IAdres)?.busnummer || busnummer.value || ''
        : (busnummer.value as IAdres)?.busnummer || '')
  );

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
