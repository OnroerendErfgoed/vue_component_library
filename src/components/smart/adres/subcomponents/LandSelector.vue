<template>
  <VlSelect
    id="land"
    v-model="modelValueCode"
    data-cy="select-land"
    :mod-disabled="modDisabled"
    :mod-error="modError"
    mod-block
    placeholder-text="Land"
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

interface LandSelectorProps {
  modelValue: string | ILand;
  landen: ILand[];
  modDisabled: boolean;
  modError: boolean;
}

const props = withDefaults(defineProps<LandSelectorProps>(), {
  modelValue: '',
  landen: () => [],
  modDisabled: false,
  modError: false,
});
const emit = defineEmits(['update:modelValue']);

const modelValueCode = computed({
  get: () => (typeof props.modelValue === 'string' ? props.modelValue : (props.modelValue as ILand)?.code || ''),
  set: (v: string) => emit('update:modelValue', props.landen.find((l) => l.code === v) || v),
});
</script>
