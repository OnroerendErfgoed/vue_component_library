<template>
  <div>
    <VlDatepicker
      data-cy="datepicker"
      v-bind="$attrs"
      placeholder="dd-mm-jjjj"
      visual-format="d-m-Y"
      :model-value="[datepickerDate]"
      :mod-error="hasError"
      :parse-date="parseDate"
      @update:model-value="setDate"
    />
    <VlFormMessageError v-if="hasFormatError">Ongeldig formaat, gebruik {{ datumDisplayFormat }}</VlFormMessageError>
  </div>
</template>

<script setup lang="ts">
import { VlDatepicker, VlFormMessageError } from '@govflanders/vl-ui-design-system-vue3';
import { format, isValid, parse } from 'date-fns';
import { computed, ref, useAttrs } from 'vue';

const attrs = useAttrs();
const modelValue = defineModel<string | null>();
const hasFormatError = ref(false);
const hasError = computed(() => hasFormatError.value || attrs['mod-error']);

const datumApiFormat = 'yyyy-MM-dd';
const datumDisplayFormat = 'dd-MM-yyyy';

const datepickerDate = computed(() => {
  return modelValue.value ? format(new Date(modelValue.value as string), datumDisplayFormat) : '';
});

const parseDate = (date: string) => {
  const parsedDisplayDate = parse(date, datumDisplayFormat, new Date());

  if (isValid(parsedDisplayDate)) {
    hasFormatError.value = false;
    return parsedDisplayDate;
  }

  const parsedApiDate = parse(date, datumApiFormat, new Date());

  if (isValid(parsedApiDate)) {
    hasFormatError.value = false;
    return parsedApiDate;
  }

  hasFormatError.value = true;
  return new Date('');
};

const setDate = (date: string[] | Date[] | Event) => {
  if (date instanceof Event) {
    return;
  }

  if (!date || !date.length) {
    modelValue.value = null;
    hasFormatError.value = false;
    return;
  }

  const selectedDate = date[0];

  const parsed = selectedDate instanceof Date
    ? selectedDate
    : parseDate(selectedDate);

  if (!isValid(parsed)) {
    hasFormatError.value = true;
    return;
  }

  hasFormatError.value = false;
  modelValue.value = format(parsed, datumApiFormat);
};
</script>
