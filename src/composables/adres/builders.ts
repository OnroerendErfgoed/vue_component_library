import { isString, pick } from 'lodash';
import { logInfo } from '@utils/index';
import type { AdresState } from './state';
import type { IGewest, ILand, ILocatieAdres, IProvincie } from '@models/locatie';

/*
 * Adres builders
 * Functions to build the address object based on the current state
 * Each function corresponds to a field in the ILocatieAdres interface
 * They handle both object and string values for fields that can be free text
 */
export const createAdresBuilders = (state: AdresState) => {
  logInfo('createAdresBuilders');

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
    if (isString(state.gemeente.value)) {
      return { naam: state.gemeente.value };
    }
    return {
      naam: state.gemeente.value.naam,
      niscode: state.gemeente.value.niscode,
    };
  };

  const buildPostcodeValue = (): ILocatieAdres['postcode'] => {
    if (!state.postcode.value) return {};
    if (isString(state.postcode.value)) {
      return { nummer: state.postcode.value };
    }
    return {
      uri: state.postcode.value.uri,
      nummer: state.postcode.value.postcode,
    };
  };

  const buildStraatValue = (): ILocatieAdres['straat'] => {
    if (!state.straat.value) return {};
    if (isString(state.straat.value)) {
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
      if (isString(state.huisnummer.value)) {
        adresValue = { huisnummer: state.huisnummer.value };
      } else {
        adresValue = pick(state.huisnummer.value, ['id', 'uri', 'huisnummer']);
      }
    }

    if (state.busnummer.value) {
      if (isString(state.busnummer.value)) {
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
};
