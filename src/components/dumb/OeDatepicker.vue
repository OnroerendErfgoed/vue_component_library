<template>
  <div>
    <vl-datepicker
      data-cy="datepicker"
      v-bind="$attrs"
      :model-value="datepickerDate"
      placeholder="dd-mm-jjjj"
      visual-format="d-m-Y"
      :value="[datepickerDate]"
      :mod-error="hasFormatError"
      @input-changed="checkInput"
      @input="setDate"
    />
    <vl-form-message-error v-if="hasFormatError"
      >Ongeldig formaat, gebruik {{ datumDisplayFormat }}</vl-form-message-error
    >
  </div>
</template>

<script setup lang="ts">
import { VlDatepicker, VlFormMessageError } from '@govflanders/vl-ui-design-system-vue3';
import { format, isMatch } from 'date-fns';
import { computed, ref } from 'vue';

const modelValue = defineModel<string | null>();
const hasFormatError = ref(false);

const datumApiFormat = 'yyyy-MM-dd';
const datumDisplayFormat = 'dd-MM-yyyy';

const datepickerDate = computed(() => {
  return modelValue.value ? format(new Date(modelValue.value as string), datumDisplayFormat) : '';
});

const setDate = (date: string[]) => {
  if (!date || !date.length || hasFormatError.value) {
    modelValue.value = null;
    return;
  }
  if (Array.isArray(date)) {
    modelValue.value = date ? format(new Date(date[0]), datumApiFormat) : null;
  }
};
const checkInput = (event: InputEvent) => {
  const date = (event.target as HTMLInputElement).value;
  if (date.length > 7 && !isMatch(date, datumDisplayFormat)) {
    hasFormatError.value = true;
  } else {
    hasFormatError.value = false;
  }
};
</script>
