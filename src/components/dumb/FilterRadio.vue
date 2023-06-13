<template>
  <div class="radio-select">
    <vl-radio
      v-for="option in options"
      :id="`radio-${option.value}`"
      :key="option.value"
      :name="`radio-${option.value}`"
      :model-value="props.value"
      :value="option.value"
      @update:model-value="updateValue"
    >
      {{ option.label }}
    </vl-radio>
  </div>
</template>

<script setup lang="ts">
import { VlRadio } from '@govflanders/vl-ui-design-system-vue3';
import type { IFilterInputRadioProps } from '@models/filter-input';

const props = withDefaults(defineProps<IFilterInputRadioProps>(), {
  value: '',
  options: () => [],
});
const emit = defineEmits(['update:value']);
const updateValue = (value: string) => emit('update:value', value);
</script>

<style lang="scss" scoped>
.radio-select {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
