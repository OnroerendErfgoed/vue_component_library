<template>
  <div class="oe-container">
    <OeModalConfirmCancelChanges
      v-if="!props.disableConfirmCloseTab"
      :open="confirmCancelChangesOpen"
      @close="confirmCancelChangesOpen = false"
      @confirm="closeTab(confirmTab as ITab, true)"
    />
    <div data-cy="oe-container-content" class="oe-container__content">
      <slot></slot>
    </div>
    <div v-if="props.tabs.length" class="bottom-tabs" data-cy="bottom-tabs">
      <vl-action-group>
        <vl-pill
          v-for="item in props.tabs"
          :key="item.id"
          :style="{ 'max-width': `${props.tabSelectorMaxWidth}px` }"
          :title="item.label"
          :class="[{ 'is-active': item.id === props.activeTab?.id }, `tab-${item.id}`]"
          :mod-closable="item.closable"
          :close-label="`Sluit tab ${item.label}`"
          mod-clickable
          @click="(event: Event) => select(event, item)"
          @close="closeTab(item)"
        >
          {{ item.label }}
        </vl-pill>
      </vl-action-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VlActionGroup, VlPill } from '@govflanders/vl-ui-design-system-vue3';
import { useEventListener } from '@vueuse/core';
import { onMounted, ref } from 'vue';
import { OeModalConfirmCancelChanges } from '@components/dumb';
import type { IContainerProps, ITab } from '@models/container';

const props = withDefaults(defineProps<IContainerProps>(), {
  tabs: () => [],
  activeTab: undefined,
  disableConfirmCloseTab: false,
  tabSelectorMaxWidth: 200,
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

// Confirm cancel modal
const confirmCancelChangesOpen = ref(false);
const confirmTab = ref<ITab>();
const closeTab = (item: ITab, confirm = false) => {
  if (confirm || props.disableConfirmCloseTab || !item.editMode) {
    confirmCancelChangesOpen.value = false;
    emit('tab-closed', item);
  } else {
    confirmTab.value = item;
    confirmCancelChangesOpen.value = true;
  }
};

onMounted(() => {
  useEventListener(document, 'closed', (evt: { detail: { modalId: string } }) => {
    if (evt.detail.modalId === 'confirm-cancel-changes-modal') {
      confirmCancelChangesOpen.value = false;
    }
  });
});
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

    .vl-layout {
      &.overview {
        max-width: 1800px;
        flex: 1;
        height: 100%;

        .vl-u-mark--info {
          height: fit-content;
        }

        .refresh-button {
          color: $primary-color;
        }

        .table {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 0.9375rem 0;

          :deep(.ag-grid-vue) {
            .status-cell {
              justify-content: center;
            }
          }
        }
      }

      &.detail {
        max-width: 1400px;
        flex: 1;

        .title-container {
          h3,
          h5 {
            margin: 0;
            color: $dark-purple !important;
          }
          h5 {
            font-weight: 100;
          }
        }

        .vl-tab__pane {
          outline: none;
        }
      }
    }
  }

  .bottom-tabs {
    position: relative;
    display: flex;
    align-items: flex-start;
    background: #f3f3f3;
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
      border-top: none;

      .vl-pill__close {
        border-right: none;
        border-bottom: none;
        border-top: none;
      }

      &.is-active {
        border-top: none;

        padding: 0 1rem;
        background-color: $primary-color;
        color: $white;
        border-top: none;

        .vl-pill__close {
          color: $white;
          height: 100%;

          &:hover:not([disabled]) {
            color: $dark-purple;
          }
        }
      }

      &--closable {
        padding-right: 0 !important;
      }
    }
  }
}
</style>
