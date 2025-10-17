import { computed, ref } from 'vue';
import { logInfo } from '@utils/index';
import type { IAdres, IGemeente, IGewest, ILand, IPostinfo, IProvincie, IStraat } from '@models/locatie';

/*
 * Static landen
 * A static list of commonly used landen to avoid excessive API calls
 * The list is sorted with Belgium on top, followed by frequently used countries and a divider
 * Additional landen can be fetched from the API and are appended to this list
 */
const STATIC_LANDEN: ILand[] = [
  { code: 'BE', naam: 'België' },
  { code: 'DE', naam: 'Duitsland' },
  { code: 'FR', naam: 'Frankrijk' },
  { code: 'GB', naam: 'Groot-Brittanië' },
  { code: 'NL', naam: 'Nederland' },
  { code: 'LU', naam: 'Luxemburg' },
  { code: 'divider', naam: '─────────────────────────' },
];

/*
 * Adres state
 * All reactive state used in the adres composable
 */
export const createAdresState = () => {
  logInfo('createAdresState');

  // Loading states
  const isLoading = ref(false);
  const isInitializing = ref(false);

  // Free text states
  const postcodeIsFreeText = ref(false);
  const straatIsFreeText = ref(false);
  const huisnummerIsFreeText = ref(false);
  const busnummerIsFreeText = ref(false);

  // Form values
  const land = ref<string | ILand>('');
  const gewest = ref<string | IGewest>('');
  const provincie = ref<string | IProvincie>('');
  const gemeente = ref<string | IGemeente>('');
  const postcode = ref<string | IPostinfo>('');
  const straat = ref<string | IStraat>('');
  const huisnummer = ref<string | IAdres>('');
  const busnummer = ref<string | IAdres>('');

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
    postcodeIsFreeText,
    straatIsFreeText,
    huisnummerIsFreeText,
    busnummerIsFreeText,

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
};

export type AdresState = ReturnType<typeof createAdresState>;
