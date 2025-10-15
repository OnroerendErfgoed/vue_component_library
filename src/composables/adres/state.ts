import { STATIC_LANDEN } from './constants';
import { computed, ref } from 'vue';
import type { IAdres, IGemeente, IGewest, ILand, IPostinfo, IProvincie, IStraat } from '@models/locatie';

export function createAdresState() {
  // Loading states
  const isLoading = ref(false);
  const isInitializing = ref(false);

  // Free text states
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
  const apiLanden = ref<ILand[]>([]);
  const landen = computed<ILand[]>(() => [...STATIC_LANDEN, ...apiLanden.value]);
  const gewesten = ref<IGewest[]>([]);
  const provincies = ref<IProvincie[]>([]);
  const gemeenten = ref<IGemeente[]>([]);
  const postinfo = ref<IPostinfo[]>([]);
  const straten = ref<IStraat[]>([]);
  const huisnummers = ref<IAdres[]>([]);
  const busnummers = ref<IAdres[]>([]);

  return {
    // Loading states
    isLoading,
    isInitializing,

    // Free text states
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
    apiLanden,
    landen,
    gewesten,
    provincies,
    gemeenten,
    postinfo,
    straten,
    huisnummers,
    busnummers,
  };
}

export type AdresState = ReturnType<typeof createAdresState>;
