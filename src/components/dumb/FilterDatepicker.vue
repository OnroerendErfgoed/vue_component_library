<template>
  <vl-datepicker
    data-cy="filter-datepicker"
    placeholder="dd-mm-jjjj"
    :value="props.value"
    visual-format="d-m-Y"
    @input="updateValue"
  />
</template>

<script setup lang="ts">
import { VlDatepicker } from '@govflanders/vl-ui-design-system-vue3';
import type { IFilterDatepickerProps } from '@models/filter-input';

const props = withDefaults(defineProps<IFilterDatepickerProps>(), {
  value: () => [],
});
const emit = defineEmits(['update:value']);
const updateValue = (event: Event) => {
  const dateValue = (event.target as HTMLInputElement)?.value;

  if (dateValue) {
    emit('update:value', [dateValue]);
  }
};
</script>

<style lang="scss" scoped>
.vl-datepicker {
  width: 100%;
}
</style>
