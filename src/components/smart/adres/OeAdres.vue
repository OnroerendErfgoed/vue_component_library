<template>
  <OeLoader v-if="isLoading" />
  <div v-else :id="`oe-adres-${id}`" class="oe-adres">
    <VlPropertiesTitle v-if="!props.hideTitle" data-cy="title-adres">{{ titleText }}</VlPropertiesTitle>

    <VlFormStructure @submit.prevent>
      <VlFormGrid
        :mod-stacked-large="props.modStackedLarge"
        :mod-stacked-small="props.modStackedSmall"
        :mod-stacked="props.modStacked"
      >
        <!-- Land -->
        <template v-if="!props.countryId">
          <VlFormColumn width="3" width-s="12">
            <VlFormMessageLabel :for="`land-${id}`" :class="{ 'vl-properties__label': adminMode }" data-cy="label-land">
              <span>Land</span>
              <VlFormMessageAnnotation v-if="props.showRequiredPerField && $props.config?.land?.required"
                >VERPLICHT</VlFormMessageAnnotation
              >
            </VlFormMessageLabel>
          </VlFormColumn>
          <VlFormColumn width="9" width-s="12">
            <LandSelector
              :id="`land-${id}`"
              v-model="land"
              :landen="landen"
              :mod-error="!!v$.land.$errors.length"
              :mod-disabled="props.modDisabled"
            />
            <VlFormMessageError v-for="error of v$.land.$errors" :key="error.$uid">
              {{ error.$message }}
            </VlFormMessageError>
          </VlFormColumn>
        </template>

        <!-- Gewest -->
        <template v-if="isBelgiumOrEmpty && !$props.config?.gewest?.hidden">
          <VlFormColumn width="3" width-s="12">
            <VlFormMessageLabel
              :for="`gewest-${id}`"
              :class="{ 'vl-properties__label': adminMode }"
              data-cy="label-gewest"
            >
              <span>Gewest</span>
              <VlFormMessageAnnotation v-if="props.showRequiredPerField && $props.config?.gewest?.required"
                >VERPLICHT</VlFormMessageAnnotation
              >
            </VlFormMessageLabel>
          </VlFormColumn>
          <VlFormColumn width="9" width-s="12">
            <GewestSelector
              :id="`gewest-${id}`"
              v-model="gewest"
              :options="gewesten"
              :disabled="!land || props.modDisabled"
              :mod-error="!!v$.gewest.$errors.length"
              :options-limit="optionsLimit"
            />
            <VlFormMessageError v-for="error of v$.gewest.$errors" :key="error.$uid" data-cy="form-error-gewest">
              {{ error.$message }}
            </VlFormMessageError>
          </VlFormColumn>
        </template>

        <!-- Provincie -->
        <template v-if="isBelgiumOrEmpty && !$props.config?.provincie?.hidden">
          <VlFormColumn width="3" width-s="12">
            <VlFormMessageLabel
              :for="`provincie-${id}`"
              :class="{ 'vl-properties__label': adminMode }"
              data-cy="label-provincie"
            >
              <span>Provincie</span>
              <VlFormMessageAnnotation v-if="props.showRequiredPerField && $props.config?.provincie?.required"
                >VERPLICHT</VlFormMessageAnnotation
              >
            </VlFormMessageLabel>
          </VlFormColumn>
          <VlFormColumn width="9" width-s="12">
            <ProvincieSelector
              :id="`provincie-${id}`"
              v-model="provincie"
              :options="provincies"
              :disabled="!land || provincies.length === 0 || props.modDisabled"
              :mod-error="!!v$.provincie.$errors.length"
              :options-limit="optionsLimit"
            />
            <VlFormMessageError v-for="error of v$.provincie.$errors" :key="error.$uid" data-cy="form-error-provincie">
              {{ error.$message }}
            </VlFormMessageError>
          </VlFormColumn>
        </template>

        <!-- Gemeente -->
        <VlFormColumn width="3" width-s="12">
          <VlFormMessageLabel
            :for="`gemeente-${id}`"
            :class="{ 'vl-properties__label': adminMode }"
            data-cy="label-gemeente"
          >
            <span>Gemeente</span>
            <VlFormMessageAnnotation v-if="props.showRequiredPerField && $props.config?.gemeente?.required"
              >VERPLICHT</VlFormMessageAnnotation
            >
          </VlFormMessageLabel>
        </VlFormColumn>
        <VlFormColumn width="9" width-s="12">
          <GemeenteSelector
            :id="`gemeente-${id}`"
            v-model="gemeente"
            :options="gemeenten"
            :disabled="!land || props.modDisabled"
            :mod-error="!!v$.gemeente.naam.$errors.length"
            :options-limit="optionsLimit"
            :is-belgium-or-empty="isBelgiumOrEmpty"
          />
          <VlFormMessageError v-for="error of v$.gemeente.naam.$errors" :key="error.$uid" data-cy="form-error-gemeente">
            {{ error.$message }}
          </VlFormMessageError>
        </VlFormColumn>

        <!-- Postcode -->
        <template v-if="!$props.config?.postcode?.hidden">
          <VlFormColumn width="3" width-s="12">
            <VlFormMessageLabel
              :for="`postcode-${id}`"
              :class="{ 'vl-properties__label': adminMode }"
              data-cy="label-postcode"
            >
              <span>Postcode</span>
              <VlFormMessageAnnotation v-if="props.showRequiredPerField && $props.config?.postcode?.required"
                >VERPLICHT</VlFormMessageAnnotation
              >
            </VlFormMessageLabel>
          </VlFormColumn>
          <VlFormColumn width="9" width-s="12">
            <PostcodeSelector
              :id="`postcode-${id}`"
              v-model="postcode"
              :options-limit="optionsLimit"
              :options="postinfo"
              :disabled="!gemeente || props.modDisabled"
              :mod-error="!!v$.postcode.nummer.$errors.length"
              :free-text="postcodeIsFreeText"
              :show-toggle="(!modDisabled && isBelgium && gemeenten.length && !isVlaamseGemeenteOrEmpty) || false"
              :is-belgium-or-empty="isBelgiumOrEmpty"
              @toggle-free-text="() => (postcodeIsFreeText = !postcodeIsFreeText)"
            />
            <VlFormMessageError
              v-for="error of v$.postcode.nummer.$errors"
              :key="error.$uid"
              data-cy="form-error-postcode"
            >
              {{ error.$message }}
            </VlFormMessageError>
          </VlFormColumn>
        </template>

        <!-- Straat -->
        <VlFormColumn width="3" width-s="12">
          <VlFormMessageLabel
            :for="`straat-${id}`"
            :class="{ 'vl-properties__label': adminMode }"
            data-cy="label-straat"
          >
            <span>Straat</span>
            <VlFormMessageAnnotation v-if="props.showRequiredPerField && $props.config?.straat?.required"
              >VERPLICHT</VlFormMessageAnnotation
            >
          </VlFormMessageLabel>
        </VlFormColumn>
        <VlFormColumn width="9" width-s="12">
          <StraatSelector
            :id="`straat-${id}`"
            v-model="straat"
            :options="straten"
            :options-limit="optionsLimit"
            :disabled="!gemeente || props.modDisabled"
            :mod-error="!!v$.straat.naam.$errors.length"
            :free-text="straatIsFreeText"
            :show-toggle="(!modDisabled && isBelgium && gemeenten.length && !isVlaamseGemeenteOrEmpty) || false"
            :is-belgium-or-empty="isBelgiumOrEmpty"
            @toggle-free-text="() => (straatIsFreeText = !straatIsFreeText)"
          />
          <VlFormMessageError v-for="error of v$.straat.naam.$errors" :key="error.$uid" data-cy="form-error-straat">
            {{ error.$message }}
          </VlFormMessageError>
        </VlFormColumn>

        <!-- Huisnummer -->
        <VlFormColumn width="3" width-s="12">
          <VlFormMessageLabel
            :for="`huisnummer-${id}`"
            :class="{ 'vl-properties__label': adminMode }"
            data-cy="label-huisnummer"
          >
            <span>Huisnummer</span>
            <VlFormMessageAnnotation v-if="props.showRequiredPerField && $props.config?.huisnummer?.required"
              >VERPLICHT</VlFormMessageAnnotation
            >
          </VlFormMessageLabel>
        </VlFormColumn>
        <VlFormColumn width="9" width-s="12">
          <HuisnummerSelector
            :id="`huisnummer-${id}`"
            v-model="huisnummer"
            :disabled="!straat || props.modDisabled"
            :free-text="huisnummerIsFreeText"
            :mod-error="!!v$.adres.huisnummer.$errors.length"
            :autocomplete-fn="performAutocompleteSearchHuisnummers"
            :show-toggle="(!modDisabled && isBelgium && gemeenten.length && !isVlaamseGemeenteOrEmpty) || false"
            :is-belgium-or-empty="isBelgiumOrEmpty"
            @toggle-free-text="() => (huisnummerIsFreeText = !huisnummerIsFreeText)"
          />
          <VlFormMessageError
            v-for="error of v$.adres.huisnummer.$errors"
            :key="error.$uid"
            data-cy="form-error-huisnummer"
          >
            {{ error.$message }}
          </VlFormMessageError>
        </VlFormColumn>

        <!-- Busnummer -->
        <template v-if="!$props.config?.busnummer?.hidden">
          <VlFormColumn width="3" width-s="12">
            <VlFormMessageLabel
              :for="`busnummer-${id}`"
              :class="{ 'vl-properties__label': adminMode }"
              data-cy="label-busnummer"
            >
              <span>Busnummer</span>
              <VlFormMessageAnnotation v-if="props.showRequiredPerField && $props.config?.busnummer?.required"
                >VERPLICHT</VlFormMessageAnnotation
              >
            </VlFormMessageLabel>
          </VlFormColumn>
          <VlFormColumn width="9" width-s="12">
            <BusnummerSelector
              :id="`busnummer-${id}`"
              v-model="busnummer"
              :disabled="!huisnummer || props.modDisabled"
              :free-text="busnummerIsFreeText"
              :mod-error="!!v$.adres.busnummer.$errors.length"
              :autocomplete-fn="performAutocompleteSearchBusnummers"
              :is-belgium-or-empty="isBelgiumOrEmpty"
              :huisnummer-is-free-text="huisnummerIsFreeText"
            />
            <VlFormMessageError
              v-for="error of v$.adres.busnummer.$errors"
              :key="error.$uid"
              data-cy="form-error-busnummer"
            >
              {{ error.$message }}
            </VlFormMessageError>
          </VlFormColumn>
        </template>
      </VlFormGrid>
    </VlFormStructure>
  </div>
</template>

<script setup lang="ts">
import BusnummerSelector from './subcomponents/BusnummerSelector.vue';
import GemeenteSelector from './subcomponents/GemeenteSelector.vue';
import GewestSelector from './subcomponents/GewestSelector.vue';
import HuisnummerSelector from './subcomponents/HuisnummerSelector.vue';
import LandSelector from './subcomponents/LandSelector.vue';
import PostcodeSelector from './subcomponents/PostcodeSelector.vue';
import ProvincieSelector from './subcomponents/ProvincieSelector.vue';
import StraatSelector from './subcomponents/StraatSelector.vue';
import { useAdresLogic } from '@composables/adres';
import {
  VlFormColumn,
  VlFormGrid,
  VlFormMessageAnnotation,
  VlFormMessageError,
  VlFormMessageLabel,
  VlFormStructure,
  VlPropertiesTitle,
} from '@govflanders/vl-ui-design-system-vue3';
import { useVuelidate } from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import { Guid } from 'guid-typescript';
import { computed, onBeforeMount } from 'vue';
import OeLoader from '@components/dumb/OeLoader.vue';
import { requiredIf } from '@utils/i18n-validators';
import type { IAdresProps } from '@models/adres';

const id = Guid.create().toString();

const props = withDefaults(defineProps<IAdresProps>(), {
  modDisabled: false,
  modStackedLarge: false,
  modStackedSmall: true,
  modStacked: false,
  hideTitle: false,
  titleText: 'Adres',
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
  adminMode: false,
});

const emit = defineEmits(['update:adres']);

const {
  isLoading,
  postcodeIsFreeText,
  straatIsFreeText,
  huisnummerIsFreeText,
  busnummerIsFreeText,
  land,
  gewest,
  provincie,
  gemeente,
  postcode,
  straat,
  huisnummer,
  busnummer,
  landen,
  gewesten,
  provincies,
  gemeenten,
  postinfo,
  straten,
  isBelgiumOrEmpty,
  isBelgium,
  isVlaamseGemeenteOrEmpty,
  adres,
  performAutocompleteSearchHuisnummers,
  performAutocompleteSearchBusnummers,
  initializeData,
} = useAdresLogic(props, emit);

// Form validation rules
const rules = computed(() => ({
  land: { required: requiredIf(!!props.config.land?.required) },
  gewest: {
    requiredIf: helpers.withParams(
      { field: 'gewest' },
      requiredIf(!!props.config.gewest?.required && !props.config.gewest?.hidden)
    ),
  },
  provincie: {
    requiredIf: helpers.withParams(
      { field: 'provincie' },
      requiredIf(!!props.config.provincie?.required && !props.config.provincie?.hidden)
    ),
  },
  gemeente: {
    naam: {
      requiredIf: helpers.withParams({ field: 'gemeente' }, requiredIf(!!props.config.gemeente?.required)),
    },
  },
  postcode: {
    nummer: {
      requiredIf: helpers.withParams(
        { field: 'postcode' },
        requiredIf(!!props.config.postcode?.required && !props.config.postcode?.hidden)
      ),
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
      requiredIf: helpers.withParams(
        { field: 'busnummer' },
        requiredIf(!!props.config.busnummer?.required && !props.config.busnummer?.hidden)
      ),
    },
  },
}));

const v$ = useVuelidate(rules, adres);

defineExpose({
  validate: () => v$.value.$validate(),
  invalid: computed(() => v$.value.$invalid),
  anyDirty: computed(() => v$.value.$anyDirty),
});

onBeforeMount(initializeData);
</script>

<style lang="scss" scoped>
.oe-adres {
  :deep(.vl-form__group) {
    padding: 0;
  }
  .vl-link {
    outline: none;
    margin-left: auto;
    cursor: pointer;
    display: block;
  }

  :deep(.vl-properties__label) {
    font-weight: 400;
    line-height: inherit;
    margin-bottom: 0;
  }
}
</style>
