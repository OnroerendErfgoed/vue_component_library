<template>
  <div class="oe-container">
    <div data-cy="oe-container-content" class="oe-container__content">
      <slot></slot>
    </div>
    <div v-if="props.tabs.length" class="bottom-tabs" data-cy="bottom-tabs">
      <vl-action-group>
        <vl-pill
          v-for="item in props.tabs"
          :key="item.id"
          :class="[{ 'is-active': item.id === props.activeTab?.id }, `tab-${item.id}`]"
          :mod-closable="item.closable"
          :close-label="`Sluit tab ${item.label}`"
          mod-clickable
          @click="(event: Event) => select(event, item)"
          @close="close(item)"
        >
          {{ item.label }}
        </vl-pill>
      </vl-action-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VlActionGroup, VlPill } from '@govflanders/vl-ui-design-system-vue3';
import type { IContainerProps, ITab } from '@models/container';

const props = withDefaults(defineProps<IContainerProps>(), {
  tabs: () => [],
  activeTab: undefined,
});
const emit = defineEmits<{
  (e: 'tab-selected', tab: ITab): void;
  (e: 'tab-closed', tab: ITab): void;
}>();

const select = (event: Event, item: ITab) => {
  if (
    (event?.target as Element)?.classList?.contains('vl-pill--clickable') ||
    (event?.target as Element)?.classList?.contains('vl-pill__text')
  ) {
    emit('tab-selected', item);
  }
};

const close = (item: ITab) => {
  emit('tab-closed', item);
};
</script>

<style lang="scss">
@import 'pyoes/scss/base-variables';

.oe-container {
  background-color: $white;
  margin: 20px 20px 10px 20px;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  overflow-y: hidden;

  &__content {
    display: flex;
    padding: 0.9375rem;
    height: 100%;
    overflow-y: auto;
  }

  .bottom-tabs {
    position: relative;
    display: flex;
    align-items: flex-start;
    background: #f3f3f3;
    height: 40px;
    border-top: 1px solid $dark-purple;

    .vl-action-group button:last-child {
      margin-right: -1px;
    }

    .vl-pill__close {
      border-radius: 0 0 0.4rem 0;
    }

    .vl-pill {
      cursor: pointer;
      margin-right: 0.5rem;
      border-radius: 0 0 0.4rem 0.4rem;
      height: 2.4rem;

      &.is-active {
        border-top: none;
        margin-left: 0.5rem;
        margin-right: 1rem;

        scale: 1.1;
        background-color: $primary-color;
        color: $white;

        .vl-pill__close {
          color: $white;
          border-top: none;

          &:hover:not([disabled]) {
            color: $dark-purple;
          }
        }
      }
    }
  }
}
</style>
