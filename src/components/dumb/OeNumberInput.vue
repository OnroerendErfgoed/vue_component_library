<template>
  <VlInputField
    type="text"
    :model-value="localValue"
    @update:model-value="updateValue"
    @keydown="preventInvalidInput"
  />
</template>

<script setup lang="ts">
import { VlInputField } from '@govflanders/vl-ui-design-system-vue3';
import { ref, watch, computed } from 'vue';

interface Props {
  modelValue: number | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
}>();

const localValue = ref<string>('');

const formatNumberToString = (value: number | null): string => {
  if (value === null) {
    return '';
  }

  return value.toString().replace(/\./g, ',');
};

watch(() => props.modelValue, (newValue) => {
  localValue.value = formatNumberToString(newValue);
}, { immediate: true });

const updateValue = (newValue?: string) => {
  // Empty value means the user cleared everything, so the value should be null
  if (!newValue) {
    localValue.value = '';
    emit('update:modelValue', null);
    return;
  }

  // Find the last comma, treating it as the decimal separator
  const lastCommaIndex = newValue.lastIndexOf(',');
  let integerPart = '';
  let decimalPart = '';

  if (lastCommaIndex !== -1) {
    integerPart = newValue.slice(0, lastCommaIndex);
    decimalPart = newValue.slice(lastCommaIndex + 1);
  } else {
    integerPart = newValue;
  }

  // Remove all non-digit characters except for the minus sign
  integerPart = integerPart.replace(/[^\d-]/g, '');
  decimalPart = decimalPart.replace(/\D/g, '');

  const formattedValue = decimalPart
    ? `${integerPart}.${decimalPart}`
    : `${integerPart}`;

  if (Number.isNaN(parseFloat(formattedValue))) {
    return;
  }

  const numericValue = parseFloat(formattedValue);
  emit('update:modelValue', numericValue);
};

const preventInvalidInput = (event: KeyboardEvent) => {
  const key = event.key;

  // Allow numbers, a single comma, minus sign, backspace, delete, arrow keys (left and right), and control keys (Ctrl+[z,x,c,v])
  if (!/^[0-9,-]$/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight' && !(event.ctrlKey && ['z', 'x', 'c', 'v'].includes(key))) {
    event.preventDefault();
  }

  // Prevent multiple minus signs or minus sign not at the start
  if (key === '-' && (event.target as HTMLInputElement).value.includes('-')) {
    event.preventDefault();
  }
  if (key === '-' && (event.target as HTMLInputElement).selectionStart !== 0) {
    event.preventDefault();
  }

  // Prevent multiple commas
  if (key === ',' && (event.target as HTMLInputElement).value.includes(',')) {
    event.preventDefault();
  }
};
</script>
