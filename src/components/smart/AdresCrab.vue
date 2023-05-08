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
            :options="postcodes"
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
            v-if="isBelgiumOrEmpty"
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
            v-if="isBelgiumOrEmpty"
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
          <VlInputField
            v-model="busnummer"
            mod-block
            :mod-error="!!v$.subadres.$errors.length"
            placeholder="Busnummer"
          />
          <vl-form-message-error v-for="error of v$.subadres.$errors" :key="error.$uid">
            {{ error.$message }}
          </vl-form-message-error>
        </VlPropertiesData>
      </VlPropertiesList>
    </VlProperties>

    Form values:
    <pre>{{ adres }}</pre>
  </div>
</template>

<script lang="ts">
export interface AdresCrabProps {
  config?: AdresCrabConfig;
}
export interface AdresCrabConfig {
  land?: ConfigOption;
  gemeente?: ConfigOption;
  postcode?: ConfigOption;
  straat?: ConfigOption;
  huisnummer?: ConfigOption;
  busnummer?: ConfigOption;
}

interface ConfigOption {
  required: boolean;
}
</script>

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
import type { Adres, Gemeente, Huisnummer, Land, Postcode, Straat } from '@models/locatie';
import { CrabService } from '@services/crab.api-service';
import { required } from '@utils/i18n-validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, ref, watch } from 'vue';

const props = withDefaults(defineProps<AdresCrabProps>(), {
  config: () => ({
    land: { required: true },
    gemeente: { required: true },
    postcode: { required: true },
    straat: { required: true },
    huisnummer: { required: true },
    busnummer: { required: false },
  }),
});

// Custom multiselect labels
const customGemeenteLabel = (option: Gemeente) => option.naam;
const customPostcodeLabel = (option: Postcode) => option.id;
const customStraatLabel = (option: Straat) => option.naam;
const customHuisnummerLabel = (option: Huisnummer) => option.naam;

// Form values
const land = ref('');
const gemeente = ref('');
const postcode = ref('');
const straat = ref('');
const huisnummer = ref('');
const busnummer = ref('');

const isBelgiumOrEmpty = computed(() => land.value === 'BE' || land.value === '');

// Form binding
const adres = computed<Adres>(() => ({
  land: land.value,
  gemeente: typeof gemeente.value === 'string' ? gemeente.value : (gemeente.value as Gemeente).niscode.toString(),
  postcode: typeof postcode.value === 'string' ? postcode.value : (postcode.value as Postcode).id.toString(),
  straat: typeof straat.value === 'string' ? straat.value : (straat.value as Straat).id.toString(),
  huisnummer: typeof huisnummer.value === 'string' ? huisnummer.value : (huisnummer.value as Huisnummer).id.toString(),
  subadres: busnummer.value,
}));

// Validation rules
const rules = computed(() => ({
  land: { required: props.config.land?.required ? required : '' },
  gemeente: { required: props.config.gemeente?.required ? required : '' },
  postcode: { required: props.config.postcode?.required ? required : '' },
  straat: { required: props.config.straat?.required ? required : '' },
  huisnummer: { required: props.config.huisnummer?.required ? required : '' },
  subadres: { required: props.config.busnummer?.required ? required : '' },
}));

// Init validation instance
const v$ = useVuelidate(rules, adres, { $autoDirty: true, $lazy: true });

// Reference data
const crabService = new CrabService();

const staticLanden: Land[] = [
  { id: 'BE', naam: 'België' },
  { id: 'DE', naam: 'Duitsland' },
  { id: 'FR', naam: 'Frankrijk' },
  { id: 'GB', naam: 'Groot-Brittanië' },
  { id: 'NL', naam: 'Nederland' },
  { id: 'LU', naam: 'Luxemburg' },
  { id: 'divider', naam: '─────────────────────────', disabled: true },
];
const apiLanden: Land[] = await crabService.getLanden();
const landen = computed<Land[]>(() => [...staticLanden, ...apiLanden]);
const gemeenten: Gemeente[] = await crabService.getGemeenten();
const postcodes = ref<Postcode[]>([]);
const straten = ref<Straat[]>([]);
const huisnummers = ref<Huisnummer[]>([]);

// Land side-effects
watch(land, () => {
  gemeente.value = '';
});

// Gemeente side-effects
watch(gemeente, async (selectedGemeente: Gemeente | string) => {
  postcode.value = '';
  straat.value = '';

  if (isBelgiumOrEmpty.value && selectedGemeente) {
    postcodes.value = await crabService.getPostcodes((selectedGemeente as Gemeente).id);
    straten.value = await crabService.getStraten((selectedGemeente as Gemeente).id);
  }
});

// Straat side-effects
watch(straat, async (selectedStraat: Straat | string) => {
  huisnummer.value = '';
  busnummer.value = '';

  if (isBelgiumOrEmpty.value && selectedStraat) {
    huisnummers.value = await crabService.getHuisnummers((selectedStraat as Straat).id);
  }
});
</script>

<style lang="scss" scoped>
.adres-crab {
  div.placeholder-container {
    margin: 0;
    border: none;
  }

  .copy-button {
    margin-left: 5px;
  }

  .vl-properties__label {
    max-width: 100%;
  }
}
</style>
