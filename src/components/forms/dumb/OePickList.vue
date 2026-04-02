<template>
  <template v-if="isEditMode">
    <slot name="input"></slot>
  </template>
  <ul :class="['pick-list', isEditMode ? 'vl-u-spacer-top--small divider' : '']">
    <li v-for="(item, index) in selectedItems" :key="index">
      {{ itemText(item) }}
      <VlButton
        v-if="isEditMode && !disabled"
        :title="`Verwijder ${itemLabel}`"
        mod-naked
        :aria-label="`Verwijder ${itemLabel}`"
        @click="emit('unselect', item)"
      >
        <FontAwesomeIcon :icon="faTrashCan" aria-hidden="true" />
      </VlButton>
    </li>
  </ul>
</template>

<script setup lang="ts" generic="T">
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { VlButton } from '@govflanders/vl-ui-design-system-vue3';

withDefaults(
  defineProps<{
    selectedItems: T[];
    itemLabel: string;
    itemText: (item: T) => string;
    isEditMode: boolean;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const emit = defineEmits<{
  unselect: [item: T];
}>();
</script>

<style lang="scss" scoped>
@import '@OnroerendErfgoed/pyoes/scss/base-variables';

.pick-list {
  max-height: 16em;
  overflow-y: auto;

  &.divider > li {
    border-bottom: 1px dashed $gray;
  }

  > li {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .vl-button {
      padding: 0;
      outline: none;
      min-height: 0;
    }
  }
}
</style>
