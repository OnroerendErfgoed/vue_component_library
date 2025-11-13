<template>
  <OeDatepicker
    data-cy="filter-datepicker"
    class="datepicker"
    :model-value="dateValue"
    @update:model-value="updateValue"
  />
</template>

<script setup lang="ts">
import { format, parse } from 'date-fns';
import { computed } from 'vue';
import { IFilterDatepickerProps, OeDatepicker } from '@/forms';

const props = withDefaults(defineProps<IFilterDatepickerProps>(), {
  value: '',
  apiFormat: 'yyyy-MM-dd',
});
const emit = defineEmits(['update:value']);

const dateValue = computed(() => {
  if (props.value) {
    return format(parse(props.value, props.apiFormat, new Date()), 'yyyy-MM-dd');
  }
  return '';
});
const updateValue = (date?: string | null) => {
  if (date) {
    emit('update:value', format(parse(date, 'yyyy-MM-dd', new Date()), props.apiFormat));
  }
};
</script>

<style lang="scss" scoped>
.datepicker {
  width: 100%;
}
</style>
