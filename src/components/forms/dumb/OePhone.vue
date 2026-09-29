<template>
  <div class="input-phone vl-grid" data-cy="input-phone-wrapper">
    <div :class="prefixClass" data-cy="prefix">
      <VlMultiselect
        v-bind="$attrs"
        :id="`${props.id}-country-code`"
        v-model="countryCode"
        class="vl-u-spacer-right--xxsmall"
        data-cy="country-code"
        :options="countryCodeList"
        mode="single"
        object
        :can-clear="false"
        :can-deselect="false"
        @select="emit('update:modelValue', '')"
      >
        <template #singlelabel="properties">
          <span> {{ properties.value?.flag }} {{ properties.value?.value }} </span>
        </template>
        <template #option="properties">
          <span> {{ properties.option?.flag }} {{ properties.option?.description }} </span>
        </template>
      </VlMultiselect>
    </div>
    <VlInputField
      v-bind="$attrs"
      :id="props.id"
      v-model="phoneNumberValue"
      data-cy="input-phone"
      :mod-error="(phoneNumberValue && inputTouched && !phoneNumberParsed?.isValid()) || $attrs['mod-error']"
      :placeholder="phoneNumberExample"
      :class="inputFieldClass"
      type="tel"
      @blur="inputTouched = true"
    ></VlInputField>
    <VlFormMessageError v-if="phoneNumberValue && inputTouched && !phoneNumberParsed?.isValid()" data-cy="input-error"
      >Ongeldige waarde, gebruik formaat vb. {{ phoneNumberExample }}
    </VlFormMessageError>
  </div>
</template>

<script setup lang="ts">
import { ICountryCode, IInputPhoneProps } from '../models/phone';
import { VlFormMessageError, VlInputField, VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import parsePhoneNumber, {
  type CountryCode,
  type ParsedNumber,
  type PhoneNumber,
  formatNumber,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import { computed, ref, watch } from 'vue';
import { sortBy } from 'lodash-es';

const DEFAULT_COUNTRY_CODE = 'BE';
const inputTouched = ref(false);

const PREFERRED_COUNTRY_CODES: CountryCode[] = ['BE', 'DE', 'FR', 'GB', 'NL', 'LU'];
const countryNames = new Intl.DisplayNames(['nl'], { type: 'region' });
const getFlag = (code: CountryCode) =>
  code
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');

const props = withDefaults(defineProps<IInputPhoneProps>(), {
  id: '',
  modelValue: '',
});
const emit = defineEmits(['update:modelValue']);

// Classes
const prefixClass = computed(() =>
  props.prefixClass ? props.prefixClass : 'vl-col--1-6 vl-col--2-6--m vl-col--3-6--xs'
);
const inputFieldClass = computed(() =>
  props.inputFieldClass ? props.inputFieldClass : 'vl-col--5-6 vl-col--4-6--m vl-col--3-6--xs'
);

// Country code
const countryCodes = [
  ...PREFERRED_COUNTRY_CODES,
  ...sortBy(
    getCountries().filter((code) => !PREFERRED_COUNTRY_CODES.includes(code)),
    (code) => countryNames.of(code) || code
  ),
];

const countryCodeList = ref<ICountryCode[]>(
  countryCodes.map((code) => {
    const callingCode = `+${getCountryCallingCode(code)}`;

    return {
      code,
      value: callingCode,
      description: `(${callingCode}) ${countryNames.of(code) || code}`,
      flag: getFlag(code),
    };
  })
);
const defaultCountryCode = ref(countryCodeList.value.find((c) => c.code === DEFAULT_COUNTRY_CODE));
const countryCode = ref(defaultCountryCode.value);

// Phone number
const phoneNumberParsed = ref<PhoneNumber>();
const phoneNumberValue = computed({
  get() {
    return parsePhoneNumber(props.modelValue, DEFAULT_COUNTRY_CODE)?.nationalNumber || '';
  },
  set(value) {
    phoneNumberParsed.value = parsePhoneNumber(value, countryCode.value?.code);
    if (value.startsWith('+') || value.startsWith('00')) {
      if (phoneNumberParsed.value?.country) {
        emit('update:modelValue', phoneNumberParsed.value?.number);
      }
    } else {
      emit('update:modelValue', phoneNumberParsed.value?.number);
    }
  },
});
const phoneNumberExample = computed(() => {
  const example = getExampleNumber(countryCode.value?.code as CountryCode, examples)?.number;
  // Formatter works but has typing issue
  return formatNumber(example as unknown as ParsedNumber, 'NATIONAL');
});

watch(
  phoneNumberValue,
  (newValue) => {
    if (newValue) {
      phoneNumberParsed.value = parsePhoneNumber(props.modelValue, DEFAULT_COUNTRY_CODE);
      if (phoneNumberParsed.value?.country) {
        countryCode.value = countryCodeList.value.find((cc) => cc.code === phoneNumberParsed.value?.country);
      }
    }
  },
  { immediate: true }
);

// Validation
const isValid = computed(() => phoneNumberParsed.value?.isValid());

defineExpose({ isValid });
</script>

<style lang="scss" scoped>
.input-phone {
  :deep(.multiselect-wrapper) {
    width: auto;
  }

  :deep(.vl-multiselect .multiselect--active:not(.multiselect--above) .multiselect__tags) {
    padding: 0px 45px 0 6px;
  }

  :deep(.multiselect-dropdown) {
    width: 250px;
    max-height: 350px;
  }
}
</style>
