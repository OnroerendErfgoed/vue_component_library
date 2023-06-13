<template>
  <vl-input-field mod-block :placeholder="props.placeholder" :value="props.value" @update:model-value="updateValue" />
</template>

<script setup lang="ts">
import { VlInputField } from '@govflanders/vl-ui-design-system-vue3';
import type { IFilterInputFieldProps } from '@models/filter-input';

const props = withDefaults(defineProps<IFilterInputFieldProps>(), {
  value: '',
  placeholder: '',
});
const emit = defineEmits(['update:value']);
const updateValue = (value: string) => emit('update:value', value);
</script>
