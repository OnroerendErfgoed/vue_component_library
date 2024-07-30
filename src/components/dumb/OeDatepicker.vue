<template>
  <vl-datepicker
    v-model="datepickerDate[0]"
    data-cy="datepicker"
    placeholder="dd-mm-jjjj"
    visual-format="d-m-Y"
    :value="datepickerDate"
    @input="setDate"
  />
</template>

<script setup lang="ts">
import { VlDatepicker } from '@govflanders/vl-ui-design-system-vue3';
import { format } from 'date-fns';
import { computed } from 'vue';

const modelValue = defineModel<string | null>();

const datumApiFormat = 'yyyy-MM-dd';
const datumDisplayFormat = 'dd-MM-yyyy';

const datepickerDate = computed(() => {
  return modelValue.value ? [format(new Date(modelValue.value as string), datumDisplayFormat)] : [];
});
const setDate = (date: string[]) => {
  if (!date || !date.length) {
    modelValue.value = null;
    return;
  }
  if (Array.isArray(date)) {
    modelValue.value = date ? format(new Date(date[0]), datumApiFormat) : null;
  }
};
</script>
