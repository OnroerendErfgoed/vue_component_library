import { cloneDeep } from 'lodash';
import { sortBy, uniqBy } from 'lodash';
import { nextTick } from 'vue';
import { logInfo } from '@utils/index';
import { removeEmptyValues } from '@utils/object';
import type { AdresState } from './state';
import type { IAdresProps } from '@models/adres';
import type { IAdres, IGemeente, IGewest, ILand, IPostinfo, IProvincie, IStraat } from '@models/locatie';
import type { CrabApiService } from '@services/crab-api.service';

interface InitializationStep {
  condition: () => boolean;
  action: () => Promise<void>;
  name: string;
}

export const createInitializers = (
  state: AdresState,
  props: IAdresProps,
  crabApiService: CrabApiService,
  helpers: {
    getGemeentenByGewest: (niscode: string) => Promise<IGemeente[]>;
    getProvinciesByGewest: (niscode: string) => IProvincie[];
    handleApiError: (error: unknown) => boolean;
    isBelgium: () => boolean;
    isBelgiumOrEmpty: () => boolean;
  }
) => {
  const initializeLandData = async () => {
    if (!helpers.isBelgium()) return;

    // Only fetch what is necessary based on visibility.
    if (!props.config?.gewest?.hidden) {
      state.gewesten.value = await crabApiService.getGewesten();
    }

    if (!props.config?.provincie?.hidden) {
      state.provincies.value = await crabApiService.getProvincies();
    }

    // Gemeenten always fetched for BE
    state.gemeenten.value = await crabApiService.getGemeenten();
  };

  const initializeGewestData = async () => {
    if (!state.gewest.value || !helpers.isBelgiumOrEmpty() || props.config?.gewest?.hidden) return;

    const niscode = (state.gewest.value as IGewest).niscode;

    if (!props.config?.provincie?.hidden) {
      state.provincies.value = helpers.getProvinciesByGewest(niscode);
    }

    state.gemeenten.value = await helpers.getGemeentenByGewest(niscode);
  };

  const initializeProvincieData = async () => {
    if (!state.provincie.value || !helpers.isBelgiumOrEmpty() || props.config?.provincie?.hidden) return;

    const niscode = (state.gewest.value as IGewest)?.niscode;
    const gemeenten = niscode ? await helpers.getGemeentenByGewest(niscode) : await crabApiService.getGemeenten();
    const provincieNiscode = (state.provincie.value as IProvincie).niscode;

    state.gemeenten.value = gemeenten.filter((g) => g.provincie?.niscode === provincieNiscode);
  };

  const initializeGemeenteData = async () => {
    if (!state.gemeente.value || !helpers.isBelgiumOrEmpty()) return;

    try {
      if (!props.config?.postcode?.hidden) {
        state.postinfo.value = await crabApiService.getPostinfo((state.gemeente.value as IGemeente).naam);
      }

      const stratenResult = await crabApiService.getStraten((state.gemeente.value as IGemeente).niscode);
      state.straten.value = sortBy(stratenResult, 'naam');
    } catch (error: unknown) {
      if (helpers.handleApiError(error)) {
        state.straten.value = [];
      }
    }
  };

  const initializeStraatData = async () => {
    if (!state.straat.value || !helpers.isBelgiumOrEmpty() || state.straatIsFreeText.value) return;

    try {
      const adressen = await crabApiService.getAdressen((state.straat.value as IStraat).id);
      state.huisnummers.value = uniqBy(
        sortBy(adressen, (s) => parseInt(s.huisnummer, 0)),
        'huisnummer'
      );
      state.huisnummerIsFreeText.value = !state.huisnummers.value.length;
    } catch (error: unknown) {
      if (helpers.handleApiError(error)) {
        state.huisnummers.value = [];
        state.busnummers.value = [];
        state.huisnummerIsFreeText.value = true;
        state.busnummerIsFreeText.value = true;
      }
    }
  };

  const initializeHuisnummerData = async (adresValue: { straat?: { id?: string } }) => {
    if (
      !adresValue.straat?.id ||
      !state.huisnummer.value ||
      !helpers.isBelgiumOrEmpty() ||
      state.huisnummerIsFreeText.value ||
      props.config?.busnummer?.hidden
    )
      return;

    const adressen = await crabApiService.getAdressen(
      adresValue.straat.id as string,
      (state.huisnummer.value as IAdres).huisnummer
    );

    state.busnummers.value = sortBy(adressen, 'busnummer').filter((v) => !!v.busnummer);

    if (state.busnummers.value.length === 1) {
      state.busnummer.value = (state.busnummers.value.at(0) as IAdres)?.busnummer;
    }

    if (state.isInitializing.value || state.busnummers.value.length === 0) {
      const huisnummerHasBusnummers = adressen.some((a) => !!a.busnummer);
      state.busnummerIsFreeText.value = state.busnummers.value.length === 0 || !huisnummerHasBusnummers;
    }
  };

  const initializationSteps: InitializationStep[] = [
    {
      name: 'land',
      condition: () => helpers.isBelgium(),
      action: initializeLandData,
    },
    {
      name: 'gewest',
      condition: () => !!state.gewest.value && !props.config?.gewest?.hidden,
      action: initializeGewestData,
    },
    {
      name: 'provincie',
      condition: () => !!state.provincie.value && !props.config?.provincie?.hidden,
      action: initializeProvincieData,
    },
    {
      name: 'gemeente',
      condition: () => !!state.gemeente.value,
      action: initializeGemeenteData,
    },
    {
      name: 'straat',
      condition: () => !!state.straat.value,
      action: initializeStraatData,
    },
    {
      name: 'huisnummer',
      condition: () => !!state.huisnummer.value && !props.config?.busnummer?.hidden,
      action: () => initializeHuisnummerData({ straat: { id: (state.straat.value as IStraat)?.id } }),
    },
  ];

  const initializeSequentially = async () => {
    state.isInitializing.value = true;

    try {
      for (const step of initializationSteps) {
        if (step.condition()) {
          await step.action();
          await nextTick();
        }
      }
    } finally {
      state.isInitializing.value = false;
      state.isLoading.value = false;
    }
  };

  const initializeData = async () => {
    logInfo('initializeData');

    state.apiLanden.value = await crabApiService.getLanden();

    if (props.adres) {
      const adresData = cloneDeep(props.adres);
      removeEmptyValues(adresData);

      state.isInitializing.value = true;

      if (props.countryId) {
        state.land.value = { code: props.countryId } as ILand;
      } else {
        state.land.value = adresData.land as ILand;
      }

      if (helpers.isBelgium()) {
        if (adresData.gewest) state.gewest.value = adresData.gewest as IGewest;
        if (adresData.provincie) state.provincie.value = adresData.provincie as IProvincie;
        if (adresData.gemeente) state.gemeente.value = adresData.gemeente as IGemeente;
        if (adresData.postcode)
          state.postcode.value = { postcode: adresData.postcode.nummer, uri: adresData.postcode.uri } as IPostinfo;
        if (adresData.straat) state.straat.value = adresData.straat as IStraat;
        if (adresData.adres) {
          state.huisnummer.value = adresData.adres as IAdres;
          state.busnummer.value = adresData.adres as IAdres;
        }

        await nextTick();
        await initializeSequentially();
      } else {
        state.gemeente.value = adresData.gemeente?.naam || '';
        state.postcode.value = adresData.postcode?.nummer || '';
        state.straat.value = adresData.straat?.naam || '';
        state.huisnummer.value = adresData.adres?.huisnummer || '';
        state.busnummer.value = adresData.adres?.busnummer || '';
        state.isInitializing.value = false;
      }
    } else if (props.countryId) {
      state.land.value = { code: props.countryId } as ILand;
    }
  };

  return {
    initializeLandData,
    initializeGewestData,
    initializeProvincieData,
    initializeGemeenteData,
    initializeStraatData,
    initializeHuisnummerData,
    initializeSequentially,
    initializeData,
  };
};
