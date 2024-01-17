<template>
  <vl-datepicker
    data-cy="filter-datepicker"
    placeholder="dd-mm-jjjj"
    :value="dateValue"
    visual-format="d-m-Y"
    @input="updateValue"
  ></vl-datepicker>
</template>

<script setup lang="ts">
import { VlDatepicker } from '@govflanders/vl-ui-design-system-vue3';
import { format, parse } from 'date-fns';
import { computed } from 'vue';
import type { IFilterDatepickerProps } from '@models/filter-input';

const props = withDefaults(defineProps<IFilterDatepickerProps>(), {
  value: () => [],
  apiFormat: 'yyyy-MM-dd',
});
const emit = defineEmits(['update:value']);

const dateValue = computed(() => {
  return [parse(props.value[0], props.apiFormat, new Date())];
});
const updateValue = (event: Event) => {
  const dateValue = (event.target as HTMLInputElement)?.value;
  if (dateValue) {
    emit('update:value', [format(parse(dateValue, 'dd-MM-yyyy', new Date()), props.apiFormat)]);
  }
};
</script>

<style lang="scss" scoped>
.vl-datepicker {
  width: 100%;
}
</style>
