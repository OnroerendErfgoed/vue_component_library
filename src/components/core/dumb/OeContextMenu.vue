<template>
  <Teleport to="body">
    <div
      v-if="isMenuOpen"
      ref="menuRef"
      class="context-menu"
      role="menu"
      :style="{ left: `${menuX}px`, top: `${menuY}px` }"
    >
      <div v-if="items.length === 0" class="context-menu__empty">{{ emptyStateText }}</div>
      <template v-for="(item, index) in items" v-else :key="index">
        <div v-if="item.type === 'divider'" class="context-menu__divider" role="separator" />
        <div
          v-else-if="item.submenu"
          class="context-menu__submenu"
          :class="{
            'context-menu__submenu--left': submenuOnLeft,
            'context-menu__submenu--active': activeSubmenuIndex === index,
          }"
          role="presentation"
          @mouseover="() => (activeSubmenuIndex = index)"
          @mouseleave="() => (activeSubmenuIndex = null)"
        >
          <button
            class="context-menu__item context-menu__submenu-trigger"
            type="button"
            role="menuitem"
            @mouseenter="handleSubmenuEnter"
            @focusin="handleSubmenuEnter"
          >
            {{ item.label }}
            <FontAwesomeIcon class="context-menu__submenu-arrow" :icon="faChevronRight" />
          </button>
          <div class="context-menu__submenu-panel" role="menu">
            <template v-for="(subitem, subindex) in item.submenu" :key="subindex">
              <div v-if="subitem.type === 'divider'" class="context-menu__divider" role="separator" />
              <button
                v-else
                class="context-menu__item"
                type="button"
                role="menuitem"
                @click="handleAction(subitem.action)"
              >
                {{ subitem.label }}
              </button>
            </template>
          </div>
        </div>
        <button v-else class="context-menu__item" type="button" role="menuitem" @click="handleAction(item.action)">
          {{ item.label }}
        </button>
      </template>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onClickOutside, useEventListener } from '@vueuse/core';
import { nextTick, ref, useTemplateRef } from 'vue';

export interface MenuItem {
  label?: string;
  action?: string;
  type?: 'divider';
  submenu?: MenuItem[];
}

interface Props {
  items: MenuItem[];
  emptyStateText?: string;
}

withDefaults(defineProps<Props>(), {
  emptyStateText: 'Geen acties beschikbaar',
});

const emit = defineEmits<{ (event: 'action', action: string): void }>();

const isMenuOpen = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const submenuOnLeft = ref(false);
const activeSubmenuIndex = ref<number | null>(null);
const menuRef = useTemplateRef<HTMLElement>('menuRef');

const openMenu = async (event: MouseEvent) => {
  if (isMenuOpen.value) isMenuOpen.value = false;
  menuX.value = event.clientX;
  menuY.value = event.clientY;
  isMenuOpen.value = true;
  await nextTick();
  const menu = menuRef.value;
  if (!menu) return;

  const rect = menu.getBoundingClientRect();
  const padding = 8;
  let desiredLeft = event.clientX;
  let desiredTop = event.clientY;

  // Adjust horizontally if menu extends beyond right edge
  if (desiredLeft + rect.width > window.innerWidth - padding) {
    desiredLeft = window.innerWidth - rect.width - padding;
  }

  // Adjust vertically if menu extends beyond bottom edge
  if (desiredTop + rect.height > window.innerHeight - padding) {
    desiredTop = window.innerHeight - rect.height - padding;
  }

  // Ensure menu doesn't go off left or top edges
  desiredLeft = Math.max(desiredLeft, padding);
  desiredTop = Math.max(desiredTop, padding);

  menuX.value = desiredLeft;
  menuY.value = desiredTop;
};

const closeMenu = () => {
  isMenuOpen.value = false;
  activeSubmenuIndex.value = null;
};

const handleAction = (action?: string) => {
  if (!action) return;
  emit('action', action);
  closeMenu();
};

const toggleMenu = (event: MouseEvent) => {
  if (isMenuOpen.value) {
    closeMenu();
  } else {
    openMenu(event);
  }
};

onClickOutside(menuRef, () => {
  if (isMenuOpen.value) closeMenu();
});

useEventListener(window, 'keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    closeMenu();
  }
});

useEventListener(window, 'scroll', () => {
  if (isMenuOpen.value) closeMenu();
});

const adjustSubmenuPosition = (submenuEl: HTMLElement, triggerEl: HTMLElement) => {
  const triggerRect = triggerEl.getBoundingClientRect();
  const submenuRect = submenuEl.getBoundingClientRect();
  const spaceOnRight = window.innerWidth - triggerRect.right;
  submenuOnLeft.value = submenuRect.width > spaceOnRight;
};

const handleSubmenuEnter = (event: MouseEvent | FocusEvent) => {
  if (!isMenuOpen.value) return;
  const target = event.currentTarget as HTMLElement | null;
  if (!target) return;
  const submenu = target.parentElement?.querySelector('.context-menu__submenu-panel') as HTMLElement | null;
  if (submenu) {
    adjustSubmenuPosition(submenu, target);
  }
};

defineExpose({ toggleMenu, closeMenu });
</script>

<style lang="scss" scoped>
$border-color: #d6d6d6;
$text-color: #2e2e2e;
$hover-bg: #f5f5f5;
$divider-color: #e0e0e0;
$menu-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

.context-menu {
  position: fixed !important;
  z-index: 9999;
  min-width: 160px;
  width: min-content;
  max-width: 260px;
  padding: 6px 0;
  background: #fff;
  border: 1px solid $border-color;
  border-radius: 6px;
  box-shadow: $menu-shadow;
  box-sizing: border-box;

  &__item {
    width: 100%;
    padding: 8px 14px;
    background: transparent;
    border: 0;
    text-align: left;
    font-size: 14px;
    color: $text-color;
    cursor: pointer;
    box-sizing: border-box;
    word-wrap: break-word;
    overflow-wrap: break-word;

    &:hover,
    &:focus-visible {
      background: $hover-bg;
      outline: none;
    }
  }

  &__divider {
    height: 1px;
    background: $divider-color;
    margin: 6px 0;
  }

  &__empty {
    padding: 12px 14px;
    color: #999;
    font-size: 14px;
    text-align: center;
  }

  &__submenu {
    position: relative;

    &-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-arrow {
      font-size: 12px;
      opacity: 0.7;
    }

    &-panel {
      position: absolute;
      top: 0;
      left: 100%;
      min-width: 210px;
      width: min-content;
      padding: 6px 0;
      background: #fff;
      border: 1px solid $border-color;
      border-radius: 6px;
      box-shadow: $menu-shadow;
      display: none;
      z-index: 10000;
      max-height: calc(100vh - 16px);
      overflow-y: auto;
    }

    &--left &-panel {
      left: auto;
      right: 100%;
      margin-left: 0;
    }

    &:hover &-panel,
    &:focus-within &-panel,
    &--active &-panel {
      display: block;
    }
  }
}
</style>
