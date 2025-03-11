<template>
  <oe-loader v-if="isLoading" />
  <div v-else class="oe-adres">
    <VlProperties>
      <VlPropertiesTitle v-if="!props.hideTitle" data-cy="title-adres">Adres</VlPropertiesTitle>
      <VlPropertiesList>
        <!-- Land -->
        <template v-if="!props.countryId">
          <VlPropertiesLabel>
            <vl-form-message-label data-cy="label-land">
              <span class="vl-u-spacer-right--xxsmall">Land</span>
              <span v-if="props.showRequiredPerField && $props.config?.land?.required" class="vl-form__annotation"
                >VERPLICHT</span
              >
            </vl-form-message-label>
          </VlPropertiesLabel>
          <VlPropertiesData>
            <VlSelect
              v-model:model-value="land"
              data-cy="select-land"
              :mod-error="!!v$.land.$errors.length"
              mod-block
              placeholder-text="Land"
              :mod-disabled="props.modDisabled"
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

        <!-- Gewest -->
        <template v-if="isBelgiumOrEmpty && !$props.config?.gewest?.hidden">
          <VlPropertiesLabel>
            <vl-form-message-label data-cy="label-gewest">
              <span class="vl-u-spacer-right--xxsmall">Gewest</span>
              <span v-if="props.showRequiredPerField && $props.config?.gewest?.required" class="vl-form__annotation"
                >VERPLICHT</span
              >
            </vl-form-message-label>
          </VlPropertiesLabel>
          <VlPropertiesData>
            <VlMultiselect
              v-model="gewest"
              placeholder="Gewest"
              data-cy="select-gewest"
              :mod-error="!!v$.gewest.$errors.length"
              :custom-label="customGewestLabel"
              :disabled="!land || props.modDisabled"
              :mod-multiple="false"
              :options="gewesten"
              :options-limit="optionsLimit"
              :preserve-search="true"
              @keydown.tab="!gewest ? $event.preventDefault() : null"
            >
              <template #noResult>
                <span>Geen resultaten gevonden...</span>
              </template>
              <template #noOptions>
                <span>Geen opties beschikbaar</span>
              </template>
            </VlMultiselect>
            <vl-form-message-error v-for="error of v$.gewest.$errors" :key="error.$uid" data-cy="form-error-gewest">
              {{ error.$message }}
            </vl-form-message-error>
          </VlPropertiesData>
        </template>

        <!-- Provincie -->
        <template v-if="isBelgiumOrEmpty && !$props.config?.provincie?.hidden">
          <VlPropertiesLabel>
            <vl-form-message-label data-cy="label-provincie">
              <span class="vl-u-spacer-right--xxsmall">Provincie</span>
              <span v-if="props.showRequiredPerField && $props.config?.provincie?.required" class="vl-form__annotation"
                >VERPLICHT</span
              >
            </vl-form-message-label>
          </VlPropertiesLabel>
          <VlPropertiesData>
            <VlMultiselect
              v-model="provincie"
              placeholder="Provincie"
              data-cy="select-provincie"
              :mod-error="!!v$.provincie.$errors.length"
              :custom-label="customProvincieLabel"
              :disabled="!land || provincies.length === 0 || props.modDisabled"
              :mod-multiple="false"
              :options="provincies"
              :options-limit="optionsLimit"
              :preserve-search="true"
              @keydown.tab="!provincie ? $event.preventDefault() : null"
            >
              <template #noResult>
                <span>Geen resultaten gevonden...</span>
              </template>
              <template #noOptions>
                <span>Geen opties beschikbaar</span>
              </template>
            </VlMultiselect>
            <vl-form-message-error
              v-for="error of v$.provincie.$errors"
              :key="error.$uid"
              data-cy="form-error-provincie"
            >
              {{ error.$message }}
            </vl-form-message-error>
          </VlPropertiesData>
        </template>

        <!-- Gemeente -->
        <VlPropertiesLabel>
          <vl-form-message-label data-cy="label-gemeente">
            <span class="vl-u-spacer-right--xxsmall">Gemeente</span>
            <span v-if="props.showRequiredPerField && $props.config?.gemeente?.required" class="vl-form__annotation"
              >VERPLICHT</span
            >
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
            :disabled="!land || props.modDisabled"
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
            :mod-disabled="props.modDisabled"
            mod-block
            placeholder="Gemeente"
          ></VlInputField>
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
            <span v-if="props.showRequiredPerField && $props.config?.postcode?.required" class="vl-form__annotation"
              >VERPLICHT</span
            >
          </vl-form-message-label>
        </VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-if="isBelgiumOrEmpty && !postcodeFreeText"
            v-model="postcode"
            placeholder="Postcode"
            data-cy="select-postcode"
            :custom-label="customPostcodeLabel"
            :disabled="!gemeente || props.modDisabled"
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
            :mod-disabled="props.modDisabled"
            mod-block
            placeholder="Postcode"
          ></VlInputField>

          <button
            v-if="isBelgium && !isVlaamseGemeenteOrEmpty"
            data-cy="action-postcode-not-found"
            class="vl-link"
            @click="postcodeFreeText = !postcodeFreeText"
          >
            <span v-if="!postcodeFreeText">Een postcode invullen die niet tussen de suggesties staat?</span>
            <span v-else>Toon lijst met suggesties</span>
          </button>

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
            <span v-if="props.showRequiredPerField && $props.config?.straat?.required" class="vl-form__annotation"
              >VERPLICHT</span
            >
          </vl-form-message-label>
        </VlPropertiesLabel>
        <VlPropertiesData>
          <VlMultiselect
            v-if="isBelgiumOrEmpty && !straatFreeText"
            v-model="straat"
            placeholder="Straat"
            data-cy="select-straat"
            :custom-label="customStraatLabel"
            :disabled="!gemeente || props.modDisabled"
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
            :mod-disabled="props.modDisabled"
            mod-block
            placeholder="Straat"
          ></VlInputField>

          <button
            v-if="isBelgium && !isVlaamseGemeenteOrEmpty"
            data-cy="action-straat-not-found"
            class="vl-link"
            @click="straatFreeText = !straatFreeText"
          >
            <span v-if="!straatFreeText">Een straat invullen die niet tussen de suggesties staat?</span>
            <span v-else>Toon lijst met suggesties</span>
          </button>

          <vl-form-message-error v-for="error of v$.straat.naam.$errors" :key="error.$uid" data-cy="form-error-straat">
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>

        <!-- Huisnummer -->
        <VlPropertiesLabel>
          <vl-form-message-label data-cy="label-huisnummer">
            <span class="vl-u-spacer-right--xxsmall">Huisnummer</span>
            <span v-if="props.showRequiredPerField && $props.config?.huisnummer?.required" class="vl-form__annotation"
              >VERPLICHT</span
            >
          </vl-form-message-label>
        </VlPropertiesLabel>
        <VlPropertiesData>
          <oe-autocomplete
            v-if="isBelgiumOrEmpty && !huisnummerFreeText"
            data-cy="autocomplete-huisnummer"
            autoselect
            allow-free-text
            :mod-error="!!v$.adres.huisnummer.$errors.length"
            :min-chars="1"
            :mod-disabled="!straat || props.modDisabled"
            :value="huisnummerAutocompleteOption"
            :callback-fn="performAutocompleteSearchHuisnummers"
            placeholder="Huisnummer"
            @update:value="updateHuisnummer"
          ></oe-autocomplete>

          <VlInputField
            v-else
            v-model="huisnummer"
            data-cy="input-huisnummer"
            mod-block
            placeholder="Huisnummer"
            :mod-disabled="!straat || props.modDisabled"
            :mod-error="!!v$.adres.huisnummer.$errors.length"
          ></VlInputField>

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
            <span v-if="props.showRequiredPerField && $props.config?.busnummer?.required" class="vl-form__annotation"
              >VERPLICHT</span
            >
          </vl-form-message-label>
        </VlPropertiesLabel>
        <VlPropertiesData>
          <oe-autocomplete
            v-if="typeof huisnummer !== 'string' && isBelgiumOrEmpty && !huisnummerFreeText && !busnummerFreeText"
            data-cy="autocomplete-busnummer"
            allow-free-text
            autoselect
            :mod-error="!!v$.adres.busnummer.$errors.length"
            :min-chars="1"
            :mod-disabled="!huisnummer || props.modDisabled"
            :value="busnummerAutocompleteOption"
            :callback-fn="performAutocompleteSearchBusnummers"
            placeholder="Busnummer"
            @update:value="updateBusnummer"
          ></oe-autocomplete>

          <VlInputField
            v-else-if="typeof busnummer === 'string' || !busnummer"
            v-model="busnummer"
            data-cy="input-busnummer"
            mod-block
            placeholder="Busnummer"
            :mod-disabled="!huisnummer || props.modDisabled"
            :mod-error="!!v$.adres.busnummer.$errors.length"
          ></VlInputField>

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
import { useVuelidate } from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import { AxiosError } from 'axios';
import { cloneDeep, pick, sortBy, uniqBy } from 'lodash';
import { computed, onMounted, ref, watch } from 'vue';
import OeAutocomplete from '@components/dumb/OeAutocomplete.vue';
import OeLoader from '@components/dumb/OeLoader.vue';
import { Niscode } from '@models/niscode.enum';
import { CrabApiService } from '@services/crab-api.service';
import { requiredIf } from '@utils/i18n-validators';
import { removeEmptyValues } from '@utils/object';
import type { IAdresProps } from '@models/adres';
import type { IAutocompleteOption } from '@models/autocomplete';
import type { IAdres, IGemeente, IGewest, ILand, ILocatieAdres, IPostinfo, IProvincie, IStraat } from '@models/locatie';

const props = withDefaults(defineProps<IAdresProps>(), {
  modDisabled: false,
  hideTitle: false,
  showRequiredPerField: false,
  config: () => ({
    land: { required: true },
    gewest: { required: true, hidden: true },
    provincie: { required: true, hidden: true },
    gemeente: { required: true },
    postcode: { required: true },
    straat: { required: true },
    huisnummer: { required: true },
    busnummer: { required: false },
  }),
  api: 'https://test-geo.onroerenderfgoed.be/',
  countryId: undefined,
  adres: undefined,
  optionsLimit: 5000,
});

const emit = defineEmits(['update:adres']);

const postcodeFreeText = ref(false);
const straatFreeText = ref(false);
const huisnummerFreeText = ref(false);
const busnummerFreeText = ref(false);
const isLoading = ref(false);

// Custom multiselect labels
const customGewestLabel = (option: IGewest) => option.naam;
const customProvincieLabel = (option: IProvincie) => option.naam;
const customGemeenteLabel = (option: IGemeente) => option.naam;
const customPostcodeLabel = (option: IPostinfo) => option.postcode;
const customStraatLabel = (option: IStraat) => option.naam;

// Form values
const land = ref<string | ILand>(''); // string is nodig om de placeholder te kunnen tonen
const gewest = ref<string | IGewest>();
const provincie = ref<string | IProvincie>();
const gemeente = ref<string | IGemeente>();
const postcode = ref<string | IPostinfo>();
const straat = ref<string | IStraat>();
const huisnummer = ref<string | IAdres>();
const busnummer = ref<string | IAdres>();

const huisnummerAutocompleteOption = computed<IAutocompleteOption<string | IAdres>>(() => {
  return {
    title: typeof huisnummer.value !== 'string' ? (huisnummer.value as IAdres)?.huisnummer : huisnummer.value,
    value: huisnummer.value,
  };
});
const busnummerAutocompleteOption = computed<IAutocompleteOption<string | IAdres>>(() => {
  return {
    title: typeof busnummer.value !== 'string' ? (busnummer.value as IAdres)?.busnummer : busnummer.value,
    value: busnummer.value,
  };
});

// Conditionals
const isBelgiumOrEmpty = computed(() => {
  return !land.value || (land.value as ILand)?.code === 'BE' || (land.value as ILand)?.code === '';
});
const isBelgium = computed(() => (land.value as ILand)?.code === 'BE');
const isVlaamseGemeenteOrEmpty = computed(() => {
  if (isBelgium.value && gemeente.value && !!gemeenten.value.length) {
    return crabApiService.vlaamseGemeenten.some((g) => g.niscode === (gemeente.value as unknown as IGemeente).niscode);
  }
  return !gemeente.value;
});

// Form binding
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
    gewest: isBelgiumOrEmpty.value && !props.config.gewest?.hidden ? gewestValue : undefined,
    provincie: isBelgiumOrEmpty.value && !props.config.provincie?.hidden ? provincieValue : undefined,
    gemeente: gemeenteValue,
    postcode: postcodeValue,
    straat: straatValue,
    adres: adresValue,
  };
});

// Form validation rules
const rules = computed(() => ({
  land: { required: requiredIf(!!props.config.land?.required) },
  gewest: { requiredIf: helpers.withParams({ field: 'gewest' }, requiredIf(!!props.config.gewest?.required)) },
  provincie: { requiredIf: helpers.withParams({ field: 'provincie' }, requiredIf(!!props.config.provincie?.required)) },
  gemeente: {
    naam: {
      requiredIf: helpers.withParams({ field: 'gemeente' }, requiredIf(!!props.config.gemeente?.required)),
    },
  },
  postcode: {
    nummer: {
      requiredIf: helpers.withParams({ field: 'postcode' }, requiredIf(!!props.config.postcode?.required)),
    },
  },
  straat: {
    naam: {
      requiredIf: helpers.withParams({ field: 'straat' }, requiredIf(!!props.config.straat?.required)),
    },
  },
  adres: {
    huisnummer: {
      requiredIf: helpers.withParams({ field: 'huisnummer' }, requiredIf(!!props.config.huisnummer?.required)),
    },
    busnummer: {
      requiredIf: helpers.withParams({ field: 'busnummer' }, requiredIf(!!props.config.busnummer?.required)),
    },
  },
}));

// Init validation instance
const v$ = useVuelidate(rules, adres);
defineExpose({ validate: () => v$.value.$validate() });

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
const gewesten = ref<IGewest[]>([]);
const provincies = ref<IProvincie[]>([]);
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
    const adres = cloneDeep(props.adres);
    removeEmptyValues(adres);

    land.value = adres.land as ILand;
    if (isBelgium.value) {
      if (adres.gewest) gewest.value = adres.gewest as IGewest;
      if (adres.provincie) provincie.value = adres.provincie as IProvincie;
      if (adres.gemeente) gemeente.value = adres.gemeente as IGemeente;
      if (adres.postcode) postcode.value = { postcode: adres.postcode.nummer, uri: adres.postcode.uri } as IPostinfo;
      if (adres.straat) straat.value = adres.straat as IStraat;
      if (adres.adres) {
        huisnummer.value = adres.adres as IAdres;
        busnummer.value = adres.adres as IAdres;
      }
    } else {
      gemeente.value = adres.gemeente?.naam || '';
      postcode.value = adres.postcode?.nummer || '';
      straat.value = adres.straat?.naam || '';
      huisnummer.value = adres.adres?.huisnummer || '';
      busnummer.value = adres.adres?.busnummer || '';
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
    gewest.value = undefined;
    provincie.value = undefined;
    gemeente.value = undefined;
  }
  if (isBelgium.value) {
    resetFreeTextState();
    if (isBelgiumOrEmpty.value && !props.config.gewest?.hidden) {
      gewesten.value = await crabApiService.getGewesten();
    }
    if (isBelgiumOrEmpty.value && !props.config.provincie?.hidden) {
      provincies.value = await crabApiService.getProvincies();
    }
    gemeenten.value = await crabApiService.getGemeenten();
  } else {
    isLoading.value = false;
  }
});

// Gewest side-effects
watch(gewest, async (selectedGewest, oldValue) => {
  if (oldValue) {
    provincie.value = undefined;
    gemeente.value = undefined;
  }
  if (isBelgiumOrEmpty.value && !props.config.gewest?.hidden) {
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
        provincies.value = await crabApiService.getProvincies();
        gemeenten.value = await crabApiService.getGemeenten();
    }
  } else {
    isLoading.value = false;
  }
});

// Provincie side-effects
watch(provincie, async (selectedProvincie, oldValue) => {
  if (oldValue) {
    gemeente.value = undefined;
  }
  if (isBelgiumOrEmpty.value && !props.config.provincie?.hidden) {
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
        gemeenten.value = await crabApiService.getGemeenten();
    }
    if (selectedProvincie) {
      resetFreeTextState();
      gemeenten.value = gemeenten.value.filter(
        (g) => g.provincie.niscode === (selectedProvincie as IProvincie).niscode
      );
    }
  } else {
    isLoading.value = false;
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

// Huisnummer side-effects
watch(huisnummer, async (selectedHuisnummer, oldValue) => {
  if (
    oldValue &&
    (selectedHuisnummer !== (oldValue as IAdres)?.huisnummer ||
      (typeof oldValue === 'string' && selectedHuisnummer !== oldValue))
  ) {
    busnummer.value = undefined;
  }

  if (adres.value.straat?.id && isBelgiumOrEmpty.value && selectedHuisnummer && !huisnummerFreeText.value) {
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
watch(huisnummerFreeText, () => (huisnummer.value = (huisnummer.value as IAdres)?.huisnummer || ''));
watch(busnummerFreeText, () => (busnummer.value = (busnummer.value as IAdres)?.busnummer || ''));

const resetFreeTextState = () => (straatFreeText.value = false);
const performAutocompleteSearchHuisnummers = (searchTerm: string): Promise<IAutocompleteOption[]> => {
  return Promise.resolve(
    huisnummers.value
      .filter((h) => h.huisnummer.includes(searchTerm))
      .map((h) => {
        return {
          title: h.huisnummer,
          value: h,
        };
      })
  );
};
const performAutocompleteSearchBusnummers = (searchTerm: string): Promise<IAutocompleteOption[]> => {
  return Promise.resolve(
    busnummers.value
      .filter((b) => b.busnummer.includes(searchTerm))
      .map((b) => {
        return {
          title: b.busnummer,
          value: b,
        };
      })
  );
};

const updateHuisnummer = (value: IAutocompleteOption<IAdres>) => (huisnummer.value = value.value);
const updateBusnummer = (value: IAutocompleteOption<IAdres>) => (busnummer.value = value.value);
</script>

<style lang="scss" scoped>
.oe-adres {
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
