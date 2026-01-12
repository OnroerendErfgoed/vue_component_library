<template>
  <VlSideNavigation>
    <VlSideNavigationList>
      <VlSideNavigationItem
        v-for="section in sideNavigation"
        :key="section.text"
        :ref="(el: VlSideNavigationItem) => (sideNavigationRefs[section.ref] = el)"
        :text="section.text"
        :expanded="autoExpand && routeMatches.some((m) => m.name === section.ref)"
      >
        <VlSideNavigationList>
          <li v-for="link in section.links" :key="link.name">
            <VlLink class="vl-u-text--ellipse" :to="{ name: link.name }" @click="onNavigate(link.name)">
              {{ link.label }}
            </VlLink>
          </li>
        </VlSideNavigationList>
      </VlSideNavigationItem>
    </VlSideNavigationList>
  </VlSideNavigation>
</template>

<script setup lang="ts">
import {
  VlLink,
  VlSideNavigation,
  VlSideNavigationItem,
  VlSideNavigationList,
} from '@govflanders/vl-ui-design-system-vue3';
import { ref } from 'vue';
import { OeSideNavigationProps } from '@/core';

withDefaults(defineProps<OeSideNavigationProps>(), {
  autoExpand: true,
  routeMatches: () => [],
});

const sideNavigationRefs = ref<Record<string, VlSideNavigationItem>>({});
</script>

<style lang="scss" scoped>
@import '@OnroerendErfgoed/pyoes/scss/base-variables.scss';

.vl-side-navigation {
  padding-left: 0;
  background: #fff;
  box-shadow: none;

  // Override WU media query styles for side navigation
  @media screen and (max-width: 767px) {
    display: block;
    min-height: initial !important;
    max-height: initial;
    padding: 1.5rem 1rem 1.5rem 1.5rem;
    background: #fff;
    box-shadow: none;
    animation: none;

    * {
      font-size: 16px;
    }
  }

  .vl-side-navigation__item {
    :deep(.vl-side-navigation__toggle) {
      margin: 10px 0;
      text-decoration: none;
      color: $primary-color;
      cursor: pointer;
      outline: none;
    }

    &:first-child {
      :deep(.vl-side-navigation__toggle) {
        margin-top: 0;
      }
    }
  }

  .vl-link {
    padding: 0.25rem 0rem;
    outline: none;
    color: $primary-color;
    text-decoration: none;
    font-weight: 400;

    &:hover {
      color: $dark-purple;
    }
  }

  .router-link-active {
    border-bottom: 3px solid lighten($primary-color, 40%);
    font-weight: 500;
  }
}
</style>
