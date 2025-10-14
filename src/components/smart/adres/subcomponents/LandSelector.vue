<template>
  <VlSelect
    data-cy="select-land"
    :model-value="modelValueCode"
    :mod-disabled="modDisabled"
    :mod-error="modError"
    mod-block
    placeholder-text="Land"
    @update:model-value="onChange"
  >
    <option v-for="item in landen" :key="item.code" :value="item.code" :disabled="item.code === 'divider'">
      {{ item.naam }}
    </option>
  </VlSelect>
</template>

<script setup lang="ts">
import { VlSelect } from '@govflanders/vl-ui-design-system-vue3';
import { computed } from 'vue';
import type { ILand } from '@models/locatie';

const props = defineProps({
  modelValue: { type: [String, Object], default: '' },
  landen: { type: Array as () => ILand[], default: () => [] },
  modDisabled: { type: Boolean, default: false },
  modError: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

const modelValueCode = computed({
  get: () => (typeof props.modelValue === 'string' ? props.modelValue : (props.modelValue as ILand)?.code || ''),
  set: (v: string) => emit('update:modelValue', props.landen.find((l) => l.code === v) || v),
});

const onChange = (v: string) => (modelValueCode.value = v);
</script>
