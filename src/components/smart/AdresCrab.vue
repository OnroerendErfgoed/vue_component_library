<template>
  <div class="adres-crab">
    <VlProperties>
      <VlPropertiesTitle data-cy="title-adres">Adres</VlPropertiesTitle>
      <VlPropertiesList>
        <!-- Land -->
        <template v-if="!props.countryId">
          <VlPropertiesLabel>
            <vl-form-message-label data-cy="label-land">
              <span class="vl-u-spacer-right--xxsmall">Land</span>
              <span v-if="$props.config?.land?.required" class="vl-form__annotation">
                {{ '(verplicht)' }}
              </span>
            </vl-form-message-label>
          </VlPropertiesLabel>
          <VlPropertiesData>
            <VlSelect
              v-model:value="land"
              data-cy="select-land"
              :mod-error="!!v$.land.$errors.length"
              mod-block
              placeholder-text="Land"
            >
              <option v-for="item in landen" :key="item.code" :value="item" :disabled="item.code === 'divider'">
                {{ item.naam }}
              </option>
            </VlSelect>
            <vl-form-message-error v-for="error of v$.land.$errors" :key="error.$uid">
              {{ error.$message }}
            </vl-form-message-error>
          </VlPropertiesData>
        </template>

        <!-- Gemeente -->
        <VlPropertiesLabel>
          <vl-form-message-label data-cy="label-gemeente">
            <span class="vl-u-spacer-right--xxsmall">Gemeente</span>
            <span v-if="$props.config?.gemeente?.required" class="vl-form__annotation">
              {{ '(verplicht)' }}
            </span>
          </vl-form-message-label>
        </VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-if="isBelgiumOrEmpty"
            v-model="gemeente"
            placeholder="Gemeente"
            data-cy="select-gemeente"
            :mod-error="!!v$.gemeente.naam.$errors.length"
            :custom-label="customGemeenteLabel"
            :disabled="!land"
            :mod-multiple="false"
            :options="gemeenten"
            :options-limit="optionsLimit"
            :preserve-search="true"
            @keydown.tab="!gemeente ? $event.preventDefault() : null"
          >
            <template #noResult>
              <span>Geen resultaten gevonden...</span>
            </template>
            <template #noOptions>
              <span>Geen opties beschikbaar</span>
            </template>
          </VlMultiselect>

          <VlInputField
            v-else
            v-model="gemeente"
            data-cy="input-gemeente"
            :mod-error="!!v$.gemeente.naam.$errors.length"
            mod-block
            placeholder="Gemeente"
          />
          <vl-form-message-error
            v-for="error of v$.gemeente.naam.$errors"
            :key="error.$uid"
            data-cy="form-error-gemeente"
          >
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>

        <!-- Postcode -->
        <VlPropertiesLabel>
          <vl-form-message-label data-cy="label-postcode">
            <span class="vl-u-spacer-right--xxsmall">Postcode</span>
            <span v-if="$props.config?.postcode?.required" class="vl-form__annotation">
              {{ '(verplicht)' }}
            </span>
          </vl-form-message-label>
        </VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-if="isBelgiumOrEmpty"
            v-model="postcode"
            placeholder="Postcode"
            data-cy="select-postcode"
            :custom-label="customPostcodeLabel"
            :disabled="!gemeente"
            :mod-error="!!v$.postcode.nummer.$errors.length"
            :mod-multiple="false"
            :options="postinfo"
            :options-limit="optionsLimit"
            :preserve-search="true"
            @keydown.tab="!postcode ? $event.preventDefault() : null"
          >
            <template #noResult>
              <span>Geen resultaten gevonden...</span>
            </template>
            <template #noOptions>
              <span>Geen opties beschikbaar</span>
            </template>
          </VlMultiselect>

          <VlInputField
            v-else
            v-model="postcode"
            data-cy="input-postcode"
            :mod-error="!!v$.postcode.nummer.$errors.length"
            mod-block
            placeholder="Postcode"
          />
          <vl-form-message-error
            v-for="error of v$.postcode.nummer.$errors"
            :key="error.$uid"
            data-cy="form-error-postcode"
          >
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>

        <!-- Straat -->
        <VlPropertiesLabel>
          <vl-form-message-label data-cy="label-straat">
            <span class="vl-u-spacer-right--xxsmall">Straat</span>
            <span v-if="$props.config?.straat?.required" class="vl-form__annotation">
              {{ '(verplicht)' }}
            </span>
          </vl-form-message-label>
        </VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-if="isBelgiumOrEmpty && !straatFreeText"
            v-model="straat"
            placeholder="Straat"
            data-cy="select-straat"
            :custom-label="customStraatLabel"
            :disabled="!gemeente"
            :mod-multiple="false"
            :mod-error="!!v$.straat.naam.$errors.length"
            :options="straten"
            :options-limit="optionsLimit"
            :preserve-search="true"
            @keydown.tab="!straat ? $event.preventDefault() : null"
          >
            <template #noResult>
              <span>Geen resultaten gevonden...</span>
            </template>
            <template #noOptions>
              <span>Geen opties beschikbaar</span>
            </template>
          </VlMultiselect>
          <VlInputField
            v-else
            v-model="straat"
            data-cy="input-straat"
            :mod-error="!!v$.straat.naam.$errors.length"
            mod-block
            placeholder="Straat"
          />
          <vl-form-message-error v-for="error of v$.straat.naam.$errors" :key="error.$uid" data-cy="form-error-straat">
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>

        <!-- Huisnummer -->
        <VlPropertiesLabel>
          <vl-form-message-label data-cy="label-huisnummer">
            <span class="vl-u-spacer-right--xxsmall">Huisnummer</span>
            <span v-if="$props.config?.huisnummer?.required" class="vl-form__annotation">
              {{ '(verplicht)' }}
            </span>
          </vl-form-message-label>
        </VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-if="isBelgiumOrEmpty && !huisnummerFreeText"
            v-model="huisnummer"
            placeholder="Huisnummer"
            data-cy="select-huisnummer"
            :custom-label="customHuisnummerLabel"
            :disabled="!straat"
            :mod-multiple="false"
            :mod-error="!!v$.adres.huisnummer.$errors.length"
            :options="huisnummers"
            :options-limit="optionsLimit"
            :preserve-search="true"
            @keydown.tab="!huisnummer ? $event.preventDefault() : null"
          >
            <template #noResult>
              <span>Geen resultaten gevonden...</span>
            </template>
            <template #noOptions>
              <span data-cy="no-options-huisnummers">Geen opties beschikbaar</span>
            </template>
          </VlMultiselect>

          <VlInputField
            v-else
            v-model="huisnummer"
            data-cy="input-huisnummer"
            mod-block
            placeholder="Huisnummer"
            :mod-error="!!v$.adres.huisnummer.$errors.length"
          />

          <button
            v-if="isBelgium && !straatFreeText && isVlaamseGemeente"
            data-cy="action-huisnummer-not-found"
            class="vl-link"
            @click="huisnummerFreeText = !huisnummerFreeText"
          >
            <span v-if="!huisnummerFreeText">Huisnummer niet gevonden?</span>
            <span v-else>Suggesties</span>
          </button>

          <vl-form-message-error
            v-for="error of v$.adres.huisnummer.$errors"
            :key="error.$uid"
            data-cy="form-error-huisnummer"
          >
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>

        <!-- Busnummer -->
        <VlPropertiesLabel>
          <vl-form-message-label data-cy="label-busnummer">
            <span class="vl-u-spacer-right--xxsmall">Busnummer</span>
            <span v-if="$props.config?.busnummer?.required" class="vl-form__annotation">
              {{ '(verplicht)' }}
            </span>
          </vl-form-message-label>
        </VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-if="isBelgiumOrEmpty && !huisnummerFreeText && !busnummerFreeText"
            v-model="busnummer"
            placeholder="Busnummer"
            data-cy="select-busnummer"
            :custom-label="customBusnummerLabel"
            :disabled="!huisnummer"
            :mod-multiple="false"
            :mod-error="!!v$.adres.busnummer.$errors.length"
            :options="busnummers"
            :options-limit="optionsLimit"
            :preserve-search="true"
            @keydown.tab="!busnummer ? $event.preventDefault() : null"
          >
            <template #noResult>
              <span>Geen resultaten gevonden...</span>
            </template>
            <template #noOptions>
              <span>Geen opties beschikbaar</span>
            </template>
          </VlMultiselect>

          <VlInputField
            v-else
            v-model="busnummer"
            data-cy="input-busnummer"
            mod-block
            placeholder="Busnummer"
            :mod-error="!!v$.adres.busnummer.$errors.length"
          />

          <button
            v-if="isBelgium && !huisnummerFreeText && isVlaamseGemeente"
            data-cy="action-busnummer-not-found"
            class="vl-link"
            @click="busnummerFreeText = !busnummerFreeText"
          >
            <span v-if="!busnummerFreeText">Busnummer niet gevonden?</span>
            <span v-else>Suggesties</span>
          </button>
          <vl-form-message-error
            v-for="error of v$.adres.busnummer.$errors"
            :key="error.$uid"
            data-cy="form-error-busnummer"
          >
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>
      </VlPropertiesList>
    </VlProperties>
  </div>
</template>

<script setup lang="ts">
import {
  VlFormMessageError,
  VlFormMessageLabel,
  VlInputField,
  VlMultiselect,
  VlProperties,
  VlPropertiesData,
  VlPropertiesLabel,
  VlPropertiesList,
  VlPropertiesTitle,
  VlSelect,
} from '@govflanders/vl-ui-design-system-vue3';
import type { IAdresCrabProps } from '@models/adres-crab';
import type { IAdres, IGemeente, ILand, ILocatieAdres, IPostinfo, IStraat } from '@models/locatie';
import { CrabApiService } from '@services/crab-api.service';
import { requiredIf } from '@utils/i18n-validators';
import { useVuelidate } from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import { AxiosError } from 'axios';
import { pick, sortBy, uniqBy } from 'lodash';
import { computed, onMounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<IAdresCrabProps>(), {
  config: () => ({
    land: { required: true },
    gemeente: { required: true },
    postcode: { required: true },
    straat: { required: true },
    huisnummer: { required: false },
    busnummer: { required: false },
  }),
  api: 'https://dev-geo.onroerenderfgoed.be/',
  countryId: undefined,
  adres: undefined,
  optionsLimit: 5000,
});

const emit = defineEmits(['update:adres']);

const straatFreeText = ref(false);
const huisnummerFreeText = ref(false);
const busnummerFreeText = ref(false);

// Custom multiselect labels
const customGemeenteLabel = (option: IGemeente) => option.naam;
const customPostcodeLabel = (option: IPostinfo) => option.postcode;
const customStraatLabel = (option: IStraat) => option.naam;
const customHuisnummerLabel = (option: IAdres) => option.huisnummer;
const customBusnummerLabel = (option: IAdres) => option.busnummer;

// Form values
const land = ref<string | ILand>(''); // string is nodig om de placeholder te kunnen tonen
const gemeente = ref<string | IGemeente>();
const postcode = ref<string | IPostinfo>();
const straat = ref<string | IStraat>();
const huisnummer = ref<string | IAdres>();
const busnummer = ref<string | IAdres>();

// Conditionals
const isBelgiumOrEmpty = computed(() => {
  return !land.value || (land.value as ILand)?.code === 'BE' || (land.value as ILand)?.code === '';
});
const isBelgium = computed(() => (land.value as ILand)?.code === 'BE');
const isVlaamseGemeente = computed(() => {
  if (isBelgium.value && gemeente.value && !!gemeenten.value.length) {
    return crabApiService.vlaamseGemeenten.some((g) => g.niscode === (gemeente.value as unknown as IGemeente).niscode);
  }
  return false;
});

// Form binding
const adres = computed<ILocatieAdres>(() => {
  let landValue: ILocatieAdres['land'];
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
    gemeente: gemeenteValue,
    postcode: postcodeValue,
    straat: straatValue,
    adres: adresValue,
  };
});

// Form validation rules
const rules = computed(() => ({
  land: { required: requiredIf(!!props.config.land?.required) },
  gemeente: {
    naam: {
      requiredIf: helpers.withParams({ field: 'gemeente' }, requiredIf(!!props.config.gemeente?.required)),
      $autoDirty: true,
    },
  },
  postcode: {
    nummer: {
      requiredIf: helpers.withParams({ field: 'postcode' }, requiredIf(!!props.config.postcode?.required)),
      $autoDirty: true,
    },
  },
  straat: {
    naam: {
      requiredIf: helpers.withParams({ field: 'straat' }, requiredIf(!!props.config.straat?.required)),
      $autoDirty: true,
    },
  },
  adres: {
    huisnummer: {
      requiredIf: helpers.withParams({ field: 'huisnummer' }, requiredIf(!!props.config.huisnummer?.required)),
      $autoDirty: true,
    },
    busnummer: {
      requiredIf: helpers.withParams({ field: 'busnummer' }, requiredIf(!!props.config.busnummer?.required)),
      $autoDirty: true,
    },
  },
}));

// Init validation instance
const v$ = useVuelidate(rules, adres, { $lazy: true });

// Reference data
const crabApiService = new CrabApiService(props.api);
const staticLanden: ILand[] = [
  { code: 'BE', naam: 'België' },
  { code: 'DE', naam: 'Duitsland' },
  { code: 'FR', naam: 'Frankrijk' },
  { code: 'GB', naam: 'Groot-Brittanië' },
  { code: 'NL', naam: 'Nederland' },
  { code: 'LU', naam: 'Luxemburg' },
  { code: 'divider', naam: '─────────────────────────' },
];
const apiLanden: ILand[] = await crabApiService.getLanden();
const landen = computed<ILand[]>(() => [...staticLanden, ...apiLanden]);
const gemeenten = ref<IGemeente[]>([]);
const postinfo = ref<IPostinfo[]>([]);
const straten = ref<IStraat[]>([]);
const huisnummers = ref<IAdres[]>([]);
const busnummers = ref<IAdres[]>([]);

onMounted(() => {
  if (props.countryId) {
    land.value = { code: props.countryId } as ILand;
  }

  if (props.adres) {
    land.value = props.adres.land as ILand;
    if (isBelgium.value) {
      props.adres.gemeente && (gemeente.value = props.adres.gemeente as IGemeente);
      props.adres.postcode &&
        (postcode.value = { postcode: props.adres.postcode.nummer, uri: props.adres.postcode.uri } as IPostinfo);
      props.adres.straat && (straat.value = props.adres.straat as IStraat);
      props.adres.adres && (huisnummer.value = props.adres.adres as IAdres);
      props.adres.adres && (busnummer.value = props.adres.adres as IAdres);
    } else {
      gemeente.value = props.adres.gemeente?.naam;
      postcode.value = props.adres.postcode?.nummer;
      straat.value = props.adres.straat?.naam;
      huisnummer.value = props.adres.adres?.huisnummer;
      busnummer.value = props.adres.adres?.busnummer;
    }
  }
});

watch(adres, () => {
  emit('update:adres', adres.value);
});

// Api changes
watch(
  () => props.countryId,
  (current) => {
    if (!current) {
      return;
    }
    land.value = {
      code: current,
    };
  }
);

// Land side-effects
watch(land, async (selectedLand, oldValue) => {
  if (oldValue) {
    gemeente.value = undefined;
  }
  if (isBelgium.value) {
    resetFreeTextState();
    gemeenten.value = await crabApiService.getGemeenten();
  }
});

// Gemeente side-effects
watch(gemeente, async (selectedGemeente, oldValue) => {
  if (oldValue) {
    postcode.value = undefined;
    straat.value = undefined;
  }

  if (isBelgiumOrEmpty.value && selectedGemeente) {
    resetFreeTextState();

    try {
      postinfo.value = await crabApiService.getPostinfo((selectedGemeente as IGemeente).naam);
      straten.value = sortBy(await crabApiService.getStraten((selectedGemeente as IGemeente).niscode), 'naam');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const knownError = error as AxiosError;
        if (knownError?.response?.status === 404) {
          straten.value = [];

          if (!isVlaamseGemeente.value) {
            straatFreeText.value = true;
            huisnummerFreeText.value = true;
            busnummerFreeText.value = true;
          }
        }
      }
    }
  }
});

// Straat side-effects
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
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const knownError = error as AxiosError;
        if (knownError?.response?.status === 404) {
          huisnummers.value = [];
          busnummers.value = [];

          if (!isVlaamseGemeente.value) {
            huisnummerFreeText.value = true;
            busnummerFreeText.value = true;
          }
        }
      }
    }
  }
});

// Huisnummer side-effects
watch(huisnummer, async (selectedHuisnummer, oldValue) => {
  if (oldValue) {
    busnummer.value = undefined;
  }

  if (adres.value.straat && isBelgiumOrEmpty.value && selectedHuisnummer && !huisnummerFreeText.value) {
    busnummers.value = sortBy(
      await crabApiService.getAdressen(adres.value.straat.id as string, (selectedHuisnummer as IAdres).huisnummer),
      'busnummer'
    ).filter((v) => !!v.busnummer);

    if (busnummers.value.length === 1) {
      busnummer.value = (busnummers.value.at(0) as IAdres)?.busnummer;
    }
  }
});

watch(huisnummerFreeText, () => (huisnummer.value = ''));
watch(busnummerFreeText, () => (busnummer.value = ''));

const resetFreeTextState = () => {
  straatFreeText.value = false;
  huisnummerFreeText.value = false;
  busnummerFreeText.value = false;
};
</script>

<style lang="scss" scoped>
.adres-crab {
  .vl-properties__label {
    max-width: 100%;
  }

  .vl-link {
    outline: none;
    float: right;
    cursor: pointer;
  }
}
</style>
