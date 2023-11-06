<template>
  <div
    v-click-outside="hideResults"
    @click="showResults = !showResults"
    class="js-vl-select"
    role="listbox"
    data-type="select-one"
    tabindex="0"
    dir="ltr"
  >
    <div class="vl-select__inner">
      <div class="vl-input-field">
        <div v-if="selectedOption" class="vl-select__item vl-select__item--selectable">
          {{ selectOptionLabel }}
        </div>
        <div v-else class="vl-select__item vl-select__item--selectable item--placeholder">
          {{ $props.placeholder }}
        </div>
      </div>
    </div>
    <div v-if="showResults" class="vl-select__list vl-select__list--dropdown">
      <div class="vl-select__list" dir="ltr" role="listbox">
        <div class="vl-select__item vl-select__item--choice is-placeholder" role="treeitem">
          <div>
            {{ $props.placeholder }}
          </div>
        </div>
        <template v-for="option in options" :key="'select-' + index">
          <div
            class="vl-select__item vl-select__item--choice vl-select__item--selectable"
            :class="{ 'is-highlighted': isEqual(selectedOption, option), '': !isEqual(selectedOption, option) }"
            role="treeitem"
            @click="selectOption(option)"
          >
            <div>
              {{ props.customLabel(option) }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { isEqual } from 'lodash';
import { ref } from 'vue';
import { vClickOutside } from '@directives/click-outside.directive';
import type { ISelectProps } from '@models/select';

const showResults = ref<boolean>(false);

const props = withDefaults(defineProps<ISelectProps<any>>(), {
  modelValue: undefined,
  options: undefined,
  placeholder: 'Selecteer een optie',
  customLabel: () => Promise.resolve(),
});

const emit = defineEmits(['update:modelValue']);

const options = props.options || [];
const selectedOption = ref(options.find((option) => isEqual(option, props.modelValue)));
const selectOptionLabel = ref<string>(props.customLabel(selectedOption?.value) as string);

const selectOption = (option: any) => {
  selectedOption.value = option;
  selectOptionLabel.value = props.customLabel(selectedOption.value) as string;
  emit('update:modelValue', selectedOption.value);
};

const hideResults = () => (showResults.value = false);
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables';

.js-vl-select {
  width: 100%;

  & .vl-select__list--dropdown {
    display: block !important;
  }

  & .vl-select__item.vl-select__item--choice.vl-select__item--selectable:hover {
    background-color: rgba($primary-color, 0.1);
  }

  .is-placeholder {
    color: rgb(170, 170, 170) !important;
  }
}
</style>
