<template>
  <div class="adres-crab">
    <VlProperties>
      <VlPropertiesTitle>Adres</VlPropertiesTitle>
      <VlPropertiesList>
        <!-- Land -->
        <VlPropertiesLabel>
          <vl-form-message-label>
            Land
            <span v-if="$props.config?.land?.required" class="vl-form__annotation">
              {{ '(verplicht)' }}
            </span>
          </vl-form-message-label>
        </VlPropertiesLabel>
        <VlPropertiesData>
          <VlSelect v-model:value="land" :mod-error="!!v$.land.$errors.length" mod-block placeholder-text="Land">
            <option v-for="item in landen" :key="item.id" :value="item.id" :disabled="item.disabled">
              {{ item.naam }}
            </option>
          </VlSelect>
          <vl-form-message-error v-for="error of v$.land.$errors" :key="error.$uid">
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>

        <!-- Gemeente -->
        <VlPropertiesLabel>
          <vl-form-message-label>
            Gemeente
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
            :mod-error="!!v$.gemeente.$errors.length"
            :custom-label="customGemeenteLabel"
            :disabled="!land"
            :mod-multiple="false"
            :options="gemeenten"
          >
            <template #noResult>
              <span>Geen resultaten gevonden...</span>
            </template>
            <template #noOptions>
              <span>Geen opties beschikbaar!</span>
            </template>
          </VlMultiselect>

          <VlInputField
            v-else
            v-model="gemeente"
            :mod-error="!!v$.gemeente.$errors.length"
            mod-block
            placeholder="Gemeente"
          />
          <vl-form-message-error v-for="error of v$.gemeente.$errors" :key="error.$uid">
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>

        <!-- Postcode -->
        <VlPropertiesLabel>
          <vl-form-message-label>
            Postcode
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
            :custom-label="customPostcodeLabel"
            :disabled="!gemeente"
            :mod-error="!!v$.postcode.$errors.length"
            :mod-multiple="false"
            :options="postinfo"
          >
            <template #noResult>
              <span>Geen resultaten gevonden...</span>
            </template>
            <template #noOptions>
              <span>Geen opties beschikbaar!</span>
            </template>
          </VlMultiselect>

          <VlInputField
            v-else
            v-model="postcode"
            :mod-error="!!v$.postcode.$errors.length"
            mod-block
            placeholder="Postcode"
          />
          <vl-form-message-error v-for="error of v$.postcode.$errors" :key="error.$uid">
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>

        <!-- Straat -->
        <VlPropertiesLabel>
          <vl-form-message-label>
            Straat
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
            :custom-label="customStraatLabel"
            :disabled="!gemeente"
            :mod-multiple="false"
            :mod-error="!!v$.straat.$errors.length"
            :options="straten"
          >
            <template #noResult>
              <span>Geen resultaten gevonden...</span>
            </template>
            <template #noOptions>
              <span>Geen opties beschikbaar!</span>
            </template>
          </VlMultiselect>
          <VlInputField
            v-else
            v-model="straat"
            :mod-error="!!v$.straat.$errors.length"
            mod-block
            placeholder="Straat"
          />
          <vl-form-message-error v-for="error of v$.straat.$errors" :key="error.$uid">
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>

        <!-- Huisnummer -->
        <VlPropertiesLabel>
          <vl-form-message-label>
            Huisnummer
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
            :custom-label="customHuisnummerLabel"
            :disabled="!straat"
            :mod-multiple="false"
            :mod-error="!!v$.huisnummer.$errors.length"
            :options="huisnummers"
          >
            <template #noResult>
              <span>Geen resultaten gevonden...</span>
            </template>
            <template #noOptions>
              <span>Geen opties beschikbaar!</span>
            </template>
          </VlMultiselect>

          <VlInputField
            v-else
            v-model="huisnummer"
            mod-block
            placeholder="Huisnummer"
            :mod-error="!!v$.huisnummer.$errors.length"
          />

          <button
            v-if="isBelgium && !straatFreeText && isVlaamseGemeente"
            class="vl-link"
            @click="huisnummerFreeText = !huisnummerFreeText"
          >
            <span v-if="!huisnummerFreeText">Huisnummer niet gevonden?</span>
            <span v-else>Suggesties</span>
          </button>

          <vl-form-message-error v-for="error of v$.huisnummer.$errors" :key="error.$uid">
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>

        <!-- Busnummer -->
        <VlPropertiesLabel>
          <vl-form-message-label>
            Busnummer
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
            :custom-label="customBusnummerLabel"
            :disabled="!huisnummer"
            :mod-multiple="false"
            :mod-error="!!v$.busnummer.$errors.length"
            :options="busnummers"
          >
            <template #noResult>
              <span>Geen resultaten gevonden...</span>
            </template>
            <template #noOptions>
              <span>Geen opties beschikbaar!</span>
            </template>
          </VlMultiselect>

          <VlInputField
            v-else
            v-model="busnummer"
            mod-block
            placeholder="Busnummer"
            :mod-error="!!v$.busnummer.$errors.length"
          />

          <button
            v-if="isBelgium && !huisnummerFreeText && isVlaamseGemeente"
            class="vl-link"
            @click="busnummerFreeText = !busnummerFreeText"
          >
            <span v-if="!busnummerFreeText">Busnummer niet gevonden?</span>
            <span v-else>Suggesties</span>
          </button>
          <vl-form-message-error v-for="error of v$.busnummer.$errors" :key="error.$uid">
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>
      </VlPropertiesList>
    </VlProperties>

    <pre>{{ adres }}</pre>
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
import type { IAdres, IAdresNew, IGemeente, ILand, IPostinfo, IStraat } from '@models/locatie';
import { CrabService } from '@services/crab.api-service';
import { required } from '@utils/i18n-validators';
import { useVuelidate } from '@vuelidate/core';
import { AxiosError } from 'axios';
import { sortBy, uniqBy } from 'lodash';
import { computed, ref, watch } from 'vue';

export interface IAdresCrabProps {
  api?: string;
  config?: IAdresCrabConfig;
}

export interface IAdresCrabConfig {
  land?: IConfigOption;
  gemeente?: IConfigOption;
  postcode?: IConfigOption;
  straat?: IConfigOption;
  huisnummer?: IConfigOption;
  busnummer?: IConfigOption;
}

interface IConfigOption {
  required: boolean;
}

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
});

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
const land = ref('');
const gemeente = ref('');
const postcode = ref('');
const straat = ref('');
const huisnummer = ref('');
const busnummer = ref('');

// Conditionals
const isBelgiumOrEmpty = computed(() => land.value === 'BE' || land.value === '');
const isBelgium = computed(() => land.value === 'BE');
const isVlaamseGemeente = computed(() => {
  if (isBelgium.value && gemeente.value) {
    return crabService.vlaamseGemeenten.some((g) => g.niscode === (gemeente.value as unknown as IGemeente).niscode);
  }
  return false;
});

// Form binding
const adres = computed<IAdresNew>(() => ({
  land: land.value,
  gemeente:
    !gemeente.value || typeof gemeente.value === 'string' ? gemeente.value : (gemeente.value as IGemeente).niscode,
  postcode:
    !postcode.value || typeof postcode.value === 'string' ? postcode.value : (postcode.value as IPostinfo).postcode,
  straat: !straat.value || typeof straat.value === 'string' ? straat.value : (straat.value as IStraat).id,
  huisnummer:
    !huisnummer.value || typeof huisnummer.value === 'string'
      ? huisnummer.value
      : (huisnummer.value as IAdres).huisnummer,
  busnummer:
    !busnummer.value || typeof busnummer.value === 'string' ? busnummer.value : (busnummer.value as IAdres).busnummer,
}));

// Validation rules
const rules = computed(() => ({
  land: { required: props.config.land?.required ? required : '' },
  gemeente: { required: props.config.gemeente?.required ? required : '' },
  postcode: { required: props.config.postcode?.required ? required : '' },
  straat: { required: props.config.straat?.required ? required : '' },
  huisnummer: { required: props.config.huisnummer?.required ? required : '' },
  busnummer: { required: props.config.busnummer?.required ? required : '' },
}));

// Init validation instance
const v$ = useVuelidate(rules, adres, { $autoDirty: true, $lazy: true });

// Reference data
const crabService = new CrabService(props.api);
const staticLanden: ILand[] = [
  { id: 'BE', naam: 'België' },
  { id: 'DE', naam: 'Duitsland' },
  { id: 'FR', naam: 'Frankrijk' },
  { id: 'GB', naam: 'Groot-Brittanië' },
  { id: 'NL', naam: 'Nederland' },
  { id: 'LU', naam: 'Luxemburg' },
  { id: 'divider', naam: '─────────────────────────', disabled: true },
];
const apiLanden: ILand[] = await crabService.getLanden();
const landen = computed<ILand[]>(() => [...staticLanden, ...apiLanden]);
const gemeenten = ref<IGemeente[]>([]);
const postinfo = ref<IPostinfo[]>([]);
const straten = ref<IStraat[]>([]);
const huisnummers = ref<IAdres[]>([]);
const busnummers = ref<IAdres[]>([]);

// Api changes
watch(
  () => props.api,
  (current) => {
    crabService.setApiUrl(current);
  }
);

// Land side-effects
watch(land, async () => {
  if (isBelgium.value) {
    resetFreeTextState();
    gemeenten.value = await crabService.getGemeenten();
  }
  gemeente.value = '';
});

// Gemeente side-effects
watch(gemeente, async (selectedGemeente: IGemeente | string) => {
  postcode.value = '';
  straat.value = '';

  if (isBelgiumOrEmpty.value && selectedGemeente) {
    resetFreeTextState();

    try {
      postinfo.value = await crabService.getPostinfo((selectedGemeente as IGemeente).naam);
      straten.value = await crabService.getStraten((selectedGemeente as IGemeente).niscode);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const knownError = error as AxiosError;
        if (knownError?.response?.status === 404) {
          if (!isVlaamseGemeente.value) {
            straten.value = [];

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
watch(straat, async (selectedStraat: IStraat | string) => {
  huisnummer.value = '';

  if (isBelgiumOrEmpty.value && selectedStraat && !straatFreeText.value) {
    resetFreeTextState();

    try {
      huisnummers.value = uniqBy(
        sortBy(await crabService.getAdressen((selectedStraat as IStraat).id), 'huisnummer'),
        'huisnummer'
      );
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const knownError = error as AxiosError;
        if (knownError?.response?.status === 404) {
          if (!isVlaamseGemeente.value) {
            huisnummers.value = [];
            busnummers.value = [];

            huisnummerFreeText.value = true;
            busnummerFreeText.value = true;
          }
        }
      }
    }
  }
});

// Huisnummer side-effects
watch(huisnummer, async (selectedHuisnummer: IAdres | string) => {
  busnummer.value = '';

  if (isBelgiumOrEmpty.value && selectedHuisnummer && !huisnummerFreeText.value) {
    busnummers.value = sortBy(
      await crabService.getAdressen(adres.value.straat, (selectedHuisnummer as IAdres).huisnummer),
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
