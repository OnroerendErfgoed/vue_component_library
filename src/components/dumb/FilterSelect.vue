<template>
  <vl-select :placeholder-text="props.placeholder" mod-block :value="props.value" @update:value="updateValue">
    <slot>
      <option v-for="option in props.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </slot>
  </vl-select>
</template>

<script setup lang="ts">
import { VlSelect } from '@govflanders/vl-ui-design-system-vue3';
import type { IFilterSelectProps } from '@models/filter-input';

const props = withDefaults(defineProps<IFilterSelectProps>(), {
  value: '',
  placeholder: '',
  options: () => [],
});
const emit = defineEmits(['update:value']);
const updateValue = (value: string) => emit('update:value', value);
</script>
