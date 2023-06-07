<template>
  <div class="container">
    <div class="container__content">
      <slot></slot>
    </div>
    <div v-if="props.tabs" class="bottom-tabs">
      <vl-action-group>
        <vl-pill
          v-for="item in props.tabs"
          :key="item.id"
          :mod-closable="item.closable"
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
import { VlPill, VlActionGroup } from '@govflanders/vl-ui-design-system-vue3';
import type { IContainerProps, ITab } from '@models/container';

const props = withDefaults(defineProps<IContainerProps>(), {
  tabs: undefined,
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
@import 'pyoes/scss/pyoes-settings';

.container {
  background-color: $white;
  margin: 20px 20px 10px 20px;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  overflow-y: hidden;

  &__content {
    height: 100%;
    overflow-y: auto;
  }

  .bottom-tabs {
    position: relative;
    display: flex;
    align-items: center;
    background: #f3f3f3;
    height: 40px;
    bottom: 0;
    border-top: 1px solid $dark-purple;

    .vl-pill {
      cursor: pointer;
      margin-right: 0.5rem;
    }
  }
}
</style>
