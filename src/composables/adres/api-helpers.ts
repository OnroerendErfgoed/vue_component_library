import { AxiosError } from 'axios';
import { uniqBy } from 'lodash';
import { Niscode } from '@models/niscode.enum';
import type { AdresState } from './state';
import type { ResetLevel } from './types';
import type { IAutocompleteOption } from '@models/autocomplete';
import type { IGemeente, IProvincie } from '@models/locatie';
import type { CrabApiService } from '@services/crab-api.service';

export function createApiHelpers(state: AdresState, crabApiService: CrabApiService, isBelgium: () => boolean) {
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

  const isVlaamseGemeenteOrEmpty = (): boolean => {
    if (isBelgium() && state.gemeente.value && !!state.gemeenten.value.length) {
      return crabApiService.vlaamseGemeenten.some(
        (g) => g.niscode === (state.gemeente.value as unknown as IGemeente).niscode
      );
    }
    return !state.gemeente.value;
  };

  const handleApiError = (error: unknown): boolean => {
    if (error instanceof AxiosError && error?.response?.status === 404) {
      if (!isVlaamseGemeenteOrEmpty()) {
        state.postcodeFreeText.value = true;
        state.straatFreeText.value = true;
        state.huisnummerFreeText.value = true;
        state.busnummerFreeText.value = true;
      }
      return true;
    }
    return false;
  };

  const resetFreeTextState = () => {
    state.straatFreeText.value = false;
  };

  const resetDependentFields = (level: ResetLevel, skipDuringInit = false) => {
    if (state.isInitializing.value && skipDuringInit) return;

    const resetMap = {
      gewest: () => {
        state.provincie.value = undefined;
        state.gemeente.value = undefined;
        state.postcode.value = undefined;
        state.straat.value = undefined;
        state.huisnummer.value = undefined;
        state.busnummer.value = undefined;
      },
      provincie: () => {
        state.gemeente.value = undefined;
        state.postcode.value = undefined;
        state.straat.value = undefined;
        state.huisnummer.value = undefined;
        state.busnummer.value = undefined;
      },
      gemeente: () => {
        state.postcode.value = undefined;
        state.straat.value = undefined;
        state.huisnummer.value = undefined;
        state.busnummer.value = undefined;
      },
      straat: () => {
        state.huisnummer.value = undefined;
        state.busnummer.value = undefined;
      },
      huisnummer: () => {
        state.busnummer.value = undefined;
      },
    };
    resetMap[level]();
  };

  const performAutocompleteSearchHuisnummers = (searchTerm: string): Promise<IAutocompleteOption[]> => {
    return Promise.resolve(
      state.huisnummers.value
        .filter((h) => h.huisnummer.includes(searchTerm))
        .map((h) => ({
          title: h.huisnummer,
          value: h,
        }))
    );
  };

  const performAutocompleteSearchBusnummers = (searchTerm: string): Promise<IAutocompleteOption[]> => {
    return Promise.resolve(
      uniqBy(state.busnummers.value, 'busnummer')
        .filter((b) => b.busnummer.includes(searchTerm))
        .map((b) => ({
          title: b.busnummer,
          value: b,
        }))
    );
  };

  return {
    getGemeentenByGewest,
    getProvinciesByGewest,
    isVlaamseGemeenteOrEmpty,
    handleApiError,
    resetFreeTextState,
    resetDependentFields,
    performAutocompleteSearchHuisnummers,
    performAutocompleteSearchBusnummers,
  };
}
