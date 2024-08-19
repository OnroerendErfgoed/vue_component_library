<template>
  <div>
    <vl-datepicker
      data-cy="datepicker"
      v-bind="$attrs"
      placeholder="dd-mm-jjjj"
      visual-format="d-m-Y"
      :value="[datepickerDate]"
      :model-value="datepickerDate"
      :mod-error="hasFormatError"
      :parse-date="parseDate"
      @input="setDate"
    />
    <vl-form-message-error v-if="hasFormatError"
      >Ongeldig formaat, gebruik {{ datumDisplayFormat }}</vl-form-message-error
    >
  </div>
</template>

<script setup lang="ts">
import { VlDatepicker, VlFormMessageError } from '@govflanders/vl-ui-design-system-vue3';
import { format, isValid, parse } from 'date-fns';
import { computed, ref } from 'vue';

const modelValue = defineModel<string | null>();
const hasFormatError = ref(false);

const datumApiFormat = 'yyyy-MM-dd';
const datumDisplayFormat = 'dd-MM-yyyy';

const datepickerDate = computed(() => {
  return modelValue.value ? format(new Date(modelValue.value as string), datumDisplayFormat) : '';
});

const parseDate = (date: string) => {
  const parsed = parse(date, datumDisplayFormat, new Date());
  hasFormatError.value = !isValid(parsed);
  return parsed;
};

const setDate = (date: string[] | Event) => {
  if (date instanceof Event) {
    return;
  }

  if (!date || !date.length) {
    modelValue.value = null;
    return;
  }

  hasFormatError.value = false;
  modelValue.value = date ? format(new Date(date[0]), datumApiFormat) : null;
};
</script>
