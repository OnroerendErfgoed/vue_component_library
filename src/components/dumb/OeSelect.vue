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
      <select
        name="vl-select-select-3"
        id="vl-select-select-3"
        class="vl-select vl-select--block vl-input-field is-hidden"
        tabindex="-1"
        style="display: none"
        data-choice="active"
      >
        <option :value="selectedOption.value" selected>{{ selectedOption.label }}</option>
      </select>
      <div class="vl-input-field">
        <div
          class="vl-select__item vl-select__item--selectable"
          data-item=""
          :data-id="selectedOption.value"
          :data-value="selectedOption.value"
        >
          {{ selectedOption.label }}
        </div>
      </div>
    </div>
    <div v-if="showResults" class="vl-select__list vl-select__list--dropdown">
      <div class="vl-select__list" dir="ltr" role="listbox">
        <template v-for="option in options">
          <div
            class="vl-select__item vl-select__item--choice vl-select__item--selectable"
            :class="{ 'is-highlighted': option.selected, '': !option.selected }"
            data-select-text="Press to select"
            data-choice=""
            :data-id="option.value"
            :data-value="option.value"
            data-choice-selectable=""
            :id="option.value"
            role="treeitem"
            @click="selectOption(option)"
          >
            <div>
              {{ option.label }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { vClickOutside } from '@directives/click-outside.directive';
import type { ISelectOption } from '@models/select';

const showResults = ref<boolean>(false);

const options = [
  { label: 'België', value: 'België', selected: true },
  { label: 'Frankrijk', value: 'Frankrijk', selected: false },
  {
    label:
      'Duitsland - Land in Centraal-Europa. Het heeft een grondgebied van 357.022 km² en grenst in het noorden aan de Oostzee.',
    value: 'Duitsland',
    selected: false,
  },
] as ISelectOption[];

const selectedOption = ref<ISelectOption>(options.find((option) => option.selected) as ISelectOption);

const selectOption = (option: ISelectOption) => {
  selectedOption.value = option;
  options.forEach((option) => (option.selected = false));
  selectedOption.value.selected = true;
};

const hideResults = () => (showResults.value = false);
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables';

.js-vl-select {
  & .vl-select__list--dropdown {
    display: block !important;
  }

  & .vl-select__item.vl-select__item--choice.vl-select__item--selectable:hover {
    background-color: $light-purple;
  }

  .vl-select__item.vl-select__item--choice.vl-select__item--selectable {
    height: auto !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
  }
}
</style>
