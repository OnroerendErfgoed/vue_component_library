<template>
  <VlSelect
    data-cy="filter-select"
    :placeholder-text="props.placeholder"
    mod-block
    :model-value="props.value"
    @update:model-value="updateValue"
  >
    <slot>
      <option
        v-for="option in props.options"
        :id="`option-${option.value}`"
        :key="option.value.toString()"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </slot>
  </VlSelect>
</template>

<script setup lang="ts">
import { VlSelect } from '@govflanders/vl-ui-design-system-vue3';
import { IFilterSelectProps } from '@/forms';

const props = withDefaults(defineProps<IFilterSelectProps>(), {
  value: '',
  placeholder: '',
  options: () => [],
});
const emit = defineEmits(['update:value']);
const updateValue = (value: string) => emit('update:value', value);
</script>
