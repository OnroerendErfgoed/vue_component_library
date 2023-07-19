<template>
  <div class="tab-container" data-cy="tab-container">
    <div class="top-tabs" data-cy="top-tabs">
      <a
        v-for="item in props.tabs"
        :key="item.id"
        :data-cy="`top-tabs-${item.id}`"
        class="top-tabs__item"
        :class="{
          active: item === activeTab,
        }"
        @click="select(item)"
      >
        <span class="top-tabs__item__name">{{ item.label }}</span>
      </a>
    </div>
    <div data-cy="tab-content" class="tab-container__content">
      <slot :active-tab="activeTab"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import type { ITabView, ITabContainerProps } from '@models/tab-container';

const props = withDefaults(defineProps<ITabContainerProps>(), {
  tabs: () => [],
});

const activeTab = shallowRef(props.tabs[0]);

const select = (item: ITabView) => {
  activeTab.value = item;
};
</script>

<style lang="scss">
@import 'pyoes/scss/pyoes-settings';

.tab-container {
  background-color: $white;
  margin: 20px 20px 10px 20px;

  &__content {
    display: flex;
    padding: 0.9375rem;
    height: 100%;
    overflow-y: auto;
  }

  .top-tabs {
    display: flex;
    justify-content: center;
    max-width: 100%;
    padding: 0 0.9375rem;

    a.top-tabs__item {
      margin-left: 3px;
      background-color: $primary-color;
      color: $white;
      font-family: 'Flanders Art Sans', Arial, sans-serif;
      padding: 0.75rem 1.5rem;
      font-size: 0.875em;
      cursor: pointer;
      text-decoration: none;

      &:hover {
        background-color: $dark-purple;
      }

      &.active {
        background-color: $very-dark-purple;
      }
    }
  }
}
</style>
