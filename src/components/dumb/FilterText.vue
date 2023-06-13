<template>
  <vl-input-field mod-block :placeholder="props.placeholder" :value="props.value" @update:model-value="updateValue" />
</template>

<script setup lang="ts">
import { VlInputField } from '@govflanders/vl-ui-design-system-vue3';
import type { IFilterTextProps } from '@models/filter-input';

const props = withDefaults(defineProps<IFilterTextProps>(), {
  value: '',
  placeholder: '',
});
const emit = defineEmits(['update:value']);
const updateValue = (value: string) => emit('update:value', value);
</script>
