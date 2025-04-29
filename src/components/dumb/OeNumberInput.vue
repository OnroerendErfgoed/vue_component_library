<template>
  <VlInputField
    type="text"
    :model-value="localValue"
    @update:model-value="updateValue"
    @keydown="preventInvalidInput"
    @paste.prevent="handlePaste"
  />
</template>

<script setup lang="ts">
import { VlInputField } from '@govflanders/vl-ui-design-system-vue3';
import { ref, watch } from 'vue';

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

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = formatNumberToString(newValue);
  },
  { immediate: true }
);

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

  const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : `${integerPart}`;

  if (Number.isNaN(parseFloat(formattedValue))) {
    return;
  }

  const numericValue = parseFloat(formattedValue);
  emit('update:modelValue', numericValue);
};

const preventInvalidInput = (event: KeyboardEvent) => {
  const key = event.key;
  const inputValue = (event.target as HTMLInputElement).value;
  const selectionStart = (event.target as HTMLInputElement).selectionStart;

  const isAllowedKey =
    /^[0-9,-]$/.test(key) ||
    ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(key) ||
    (event.ctrlKey && ['z', 'x', 'c', 'v'].includes(key));

  if (!isAllowedKey) {
    event.preventDefault();
    return;
  }

  // Prevent multiple minus signs or minus sign not at the start
  if (key === '-') {
    const hasMinusSign = inputValue.includes('-');
    const isNotAtStart = selectionStart !== 0;

    if (hasMinusSign || isNotAtStart) {
      event.preventDefault();
    }
  }

  // Prevent multiple commas
  if (key === ',' && inputValue.includes(',')) {
    event.preventDefault();
  }
};

const handlePaste = (event: ClipboardEvent) => {
  const pastedData = event.clipboardData?.getData('text') || '';
  updateValue(pastedData);
};
</script>
