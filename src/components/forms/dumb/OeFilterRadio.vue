<template>
  <div data-cy="filter-radio" class="radio-select">
    <vl-radio
      v-for="option in options"
      :id="`radio-${props.id}-${option.value}`"
      :key="option.value"
      :name="`radio-${props.id}`"
      :model-value="props.value"
      :value="option.value"
      @update:model-value="updateValue(option)"
    >
      {{ option.label }}
    </vl-radio>
  </div>
</template>

<script setup lang="ts">
import { VlRadio } from '@govflanders/vl-ui-design-system-vue3';
import { IFilterInputRadioProps, IOption } from '@/forms';

const props = withDefaults(defineProps<IFilterInputRadioProps>(), {
  id: '',
  value: '',
  options: () => [],
});

const emit = defineEmits(['update:value']);
const updateValue = (value: IOption) => emit('update:value', value);
</script>

<style lang="scss" scoped>
.radio-select {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
