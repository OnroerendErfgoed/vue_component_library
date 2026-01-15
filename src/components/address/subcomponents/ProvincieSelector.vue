<template>
  <VlMultiselect
    v-if="!readMode"
    id="provincie"
    v-model="modelValueComputed"
    data-cy="select-provincie"
    placeholder="Provincie"
    mode="single"
    :options="options"
    :disabled="disabled"
    :mod-error="modError"
    :limit="optionsLimit"
    :can-deselect="false"
    searchable
    object
    label="naam"
    value-prop="niscode"
    @keydown.tab="!modelValueComputed ? $event.preventDefault() : null"
  >
    <template #noresults><li class="multiselect-option">Geen resultaten gevonden...</li></template>
    <template #nooptions><li class="multiselect-option">Geen opties beschikbaar</li></template>
  </VlMultiselect>
  <VlPropertiesData v-else data-cy="provincie-value">
    {{ selectedProvincie || '-' }}
  </VlPropertiesData>
</template>

<script setup lang="ts">
import { VlMultiselect, VlPropertiesData } from '@govflanders/vl-ui-design-system-vue3';
import { computed } from 'vue';
import type { IProvincie } from '@models/locatie';

interface ProvincieSelectorProps {
  modelValue: string | IProvincie | undefined;
  options: IProvincie[];
  disabled: boolean;
  modError: boolean;
  optionsLimit: number;
  readMode: boolean;
}

const props = withDefaults(defineProps<ProvincieSelectorProps>(), {
  modelValue: undefined,
  options: () => [],
  disabled: false,
  modError: false,
  optionsLimit: 5000,
  readMode: false,
});
const emit = defineEmits(['update:modelValue']);

const modelValueComputed = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const selectedProvincie = computed(() =>
  typeof props.modelValue === 'string' ? props.modelValue : props.modelValue?.naam
);
</script>
