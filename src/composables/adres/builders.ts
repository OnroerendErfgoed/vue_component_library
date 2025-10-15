import { pick } from 'lodash';
import type { AdresState } from './state';
import type { IGewest, ILand, ILocatieAdres, IProvincie } from '@models/locatie';

// Type guards
export const isStringValue = <T>(value: string | T | undefined): value is string => {
  return typeof value === 'string';
};

export function createAdresBuilders(state: AdresState) {
  const buildLandValue = (): ILocatieAdres['land'] => {
    if (!state.land.value) return {};
    return {
      code: (state.land.value as ILand).code,
      naam: (state.land.value as ILand).naam,
    };
  };

  const buildGewestValue = (): ILocatieAdres['gewest'] => {
    if (!state.gewest.value) return {};
    return {
      naam: (state.gewest.value as IGewest).naam,
      niscode: (state.gewest.value as IGewest).niscode,
    };
  };

  const buildProvincieValue = (): ILocatieAdres['provincie'] => {
    if (!state.provincie.value) return {};
    return {
      naam: (state.provincie.value as IProvincie).naam,
      niscode: (state.provincie.value as IProvincie).niscode,
    };
  };

  const buildGemeenteValue = (): ILocatieAdres['gemeente'] => {
    if (!state.gemeente.value) return {};
    if (isStringValue(state.gemeente.value)) {
      return { naam: state.gemeente.value };
    }
    return {
      naam: state.gemeente.value.naam,
      niscode: state.gemeente.value.niscode,
    };
  };

  const buildPostcodeValue = (): ILocatieAdres['postcode'] => {
    if (!state.postcode.value) return {};
    if (isStringValue(state.postcode.value)) {
      return { nummer: state.postcode.value };
    }
    return {
      uri: state.postcode.value.uri,
      nummer: state.postcode.value.postcode,
    };
  };

  const buildStraatValue = (): ILocatieAdres['straat'] => {
    if (!state.straat.value) return {};
    if (isStringValue(state.straat.value)) {
      return { naam: state.straat.value };
    }
    return {
      naam: state.straat.value.naam,
      id: state.straat.value.id,
      uri: state.straat.value.uri,
    };
  };

  const buildAdresValue = (): ILocatieAdres['adres'] => {
    let adresValue: ILocatieAdres['adres'] = {};

    if (state.huisnummer.value) {
      if (isStringValue(state.huisnummer.value)) {
        adresValue = { huisnummer: state.huisnummer.value };
      } else {
        adresValue = pick(state.huisnummer.value, ['id', 'uri', 'huisnummer']);
      }
    }

    if (state.busnummer.value) {
      if (isStringValue(state.busnummer.value)) {
        adresValue = { ...adresValue, busnummer: state.busnummer.value };
      } else {
        adresValue = {
          ...adresValue,
          busnummer: state.busnummer.value.busnummer,
          ...(!!state.busnummer.value.id && { id: state.busnummer.value.id }),
          ...(!!state.busnummer.value.uri && { uri: state.busnummer.value.uri }),
        };
      }
    }

    return adresValue;
  };

  return {
    buildLandValue,
    buildGewestValue,
    buildProvincieValue,
    buildGemeenteValue,
    buildPostcodeValue,
    buildStraatValue,
    buildAdresValue,
  };
}
