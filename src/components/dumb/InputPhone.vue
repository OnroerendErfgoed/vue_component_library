<template>
  <div class="input-phone vl-grid">
    <div class="vl-col--1-6">
      <vl-multiselect
        v-model="countryCode"
        class="vl-u-spacer-right--xxsmall"
        :allow-empty="false"
        :searchable="false"
        :mod-multiple="false"
        :options="countryCodeList"
        :custom-label="(cc: ICountryCode) => cc.value"
      >
        <template #singleLabel="props">
          <span class="flag" :class="props.option.code.toLowerCase()">{{ props.option.value }}</span>
        </template>

        <template #option="props">
          <span class="flag" :class="props.option.code.toLowerCase()">{{ props.option.description }}</span>
        </template>
      </vl-multiselect>
    </div>
    <vl-input-field
      :model-value="phonenumber"
      :placeholder="phonenumberExample"
      class="vl-col--5-6"
      type="tel"
      @update:model-value="setPhonenumber"
      @blur="inputTouched = true"
    ></vl-input-field>
    <vl-form-message-error v-if="inputTouched && !inputValid">
      Ongeldige waarde, gebruik formaat vb. {{ phonenumberExample }}
    </vl-form-message-error>
  </div>
</template>

<script setup lang="ts">
import { VlFormMessageError, VlInputField, VlMultiselect } from '@govflanders/vl-ui-design-system-vue3';
import type { ICountryCode } from '@models/input-phone';
import parsePhoneNumber, {
  formatIncompletePhoneNumber,
  formatNumber,
  getExampleNumber,
  type CountryCode,
  type ParsedNumber,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import { isEqual } from 'lodash';
import { computed, ref, watch } from 'vue';

const countryCodeList = ref<ICountryCode[]>([
  { value: '+32', description: '(+32) België', code: 'BE' },
  { value: '+49', description: '(+49) Duitsland', code: 'DE' },
  { value: '+33', description: '(+33) Frankrijk', code: 'FR' },
  { value: '+44', description: '(+44) Groot-Brittannië', code: 'GB' },
  { value: '+31', description: '(+31) Nederland', code: 'NL' },
  { value: '+352', description: '(+352) Luxemburg', code: 'LU' },
]);
const countryCode = ref(countryCodeList.value.find((c) => c.code === 'BE'));

const phonenumber = ref('');
const setPhonenumber = (number: string) =>
  (phonenumber.value = formatIncompletePhoneNumber(number, countryCode.value?.code));
const phonenumberExample = computed(() => {
  const example = getExampleNumber(countryCode.value?.code as CountryCode, examples)?.number;
  // Formatter works but has typing issue
  return formatNumber(example as unknown as ParsedNumber, 'NATIONAL');
});

const inputTouched = ref(false);
const inputValid = computed(() => {
  if (phonenumber.value) {
    const parsed = parsePhoneNumber(phonenumber.value, countryCode.value?.code);
    return parsed?.isValid() || false;
  }
  return true;
});

watch(countryCode, (newValue, oldValue) => {
  if (newValue && !isEqual(newValue, oldValue)) {
    phonenumber.value = '';
  }
});
</script>

<style lang="scss" scoped>
.input-phone {
  :deep(.multiselect__content-wrapper) {
    width: auto;
  }

  :deep(.vl-multiselect .multiselect--active:not(.multiselect--above) .multiselect__tags) {
    padding: 0px 45px 0 6px;
  }

  span.flag {
    background-repeat: no-repeat;
    background-size: 25px 20px;
    padding-left: 30px;

    &.be {
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NTAiIGhlaWdodD0iMzkwIj4KPHJlY3Qgd2lkdGg9IjQ1MCIgaGVpZ2h0PSIzOTAiIGZpbGw9IiNFRDI5MzkiLz4KPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzOTAiIGZpbGw9IiNGQUUwNDIiLz4KPHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIzOTAiLz4KPC9zdmc+);
    }
    &.de {
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIKCSJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgNSAzIj4KCTxkZXNjPkZsYWcgb2YgR2VybWFueTwvZGVzYz4KCTxyZWN0IGlkPSJibGFja19zdHJpcGUiIHdpZHRoPSI1IiBoZWlnaHQ9IjMiIHk9IjAiIHg9IjAiIGZpbGw9IiMwMDAiLz4KCTxyZWN0IGlkPSJyZWRfc3RyaXBlIiB3aWR0aD0iNSIgaGVpZ2h0PSIyIiB5PSIxIiB4PSIwIiBmaWxsPSIjRDAwIi8+Cgk8cmVjdCBpZD0iZ29sZF9zdHJpcGUiIHdpZHRoPSI1IiBoZWlnaHQ9IjEiIHk9IjIiIHg9IjAiIGZpbGw9IiNGRkNFMDAiLz4KPC9zdmc+);
    }
    &.fr {
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MDAiIGhlaWdodD0iNjAwIj48cmVjdCB3aWR0aD0iOTAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI0VEMjkzOSIvPjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZmZmIi8+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMwMDIzOTUiLz48L3N2Zz4=);
    }
    &.gb {
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCAzMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIj4KPGNsaXBQYXRoIGlkPSJ0Ij4KCTxwYXRoIGQ9Ik0zMCwxNSBoMzAgdjE1IHogdjE1IGgtMzAgeiBoLTMwIHYtMTUgeiB2LTE1IGgzMCB6Ii8+CjwvY2xpcFBhdGg+CjxwYXRoIGQ9Ik0wLDAgdjMwIGg2MCB2LTMwIHoiIGZpbGw9IiMwMDI0N2QiLz4KPHBhdGggZD0iTTAsMCBMNjAsMzAgTTYwLDAgTDAsMzAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI2Ii8+CjxwYXRoIGQ9Ik0wLDAgTDYwLDMwIE02MCwwIEwwLDMwIiBjbGlwLXBhdGg9InVybCgjdCkiIHN0cm9rZT0iI2NmMTQyYiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Ik0zMCwwIHYzMCBNMCwxNSBoNjAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxMCIvPgo8cGF0aCBkPSJNMzAsMCB2MzAgTTAsMTUgaDYwIiBzdHJva2U9IiNjZjE0MmIiIHN0cm9rZS13aWR0aD0iNiIvPgo8L3N2Zz4=);
    }
    &.nl {
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgOSA2Ij4KPHJlY3QgZmlsbD0iIzIxNDY4QiIJd2lkdGg9IjkiIGhlaWdodD0iNiIvPgo8cmVjdCBmaWxsPSIjRkZGIiB3aWR0aD0iOSIgaGVpZ2h0PSI0Ii8+CjxyZWN0IGZpbGw9IiNBRTFDMjgiCXdpZHRoPSI5IiBoZWlnaHQ9IjIiLz4KPC9zdmc+);
    }
    &.lu {
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjYwMCI+CjxyZWN0IHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjMwMCIgeT0iMzAwIiBmaWxsPSIjMDBBMURFCiIvPgo8cmVjdCB3aWR0aD0iMTAwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlZDI5MzkiLz4KPHJlY3Qgd2lkdGg9IjEwMDAiIGhlaWdodD0iMjAwIiB5PSIyMDAiIGZpbGw9IiNmZmYiLz4KPC9zdmc+);
    }
  }
}
</style>
