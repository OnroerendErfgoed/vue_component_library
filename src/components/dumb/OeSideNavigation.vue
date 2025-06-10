<template>
  <VlSideNavigation>
    <VlSideNavigationList>
      <VlSideNavigationItem
        v-for="section in sideNavigation"
        :key="section.text"
        :ref="(el: VlSideNavigationItem) => (sideNavigationRefs[section.ref] = el)"
        :text="section.text"
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
import { onMounted, ref } from 'vue';
import { OeSideNavigationProps } from '@models/side-navigation';

const props = withDefaults(defineProps<OeSideNavigationProps>(), {
  autoExpand: true,
  routeMatches: () => [],
});

const sideNavigationRefs = ref<Record<string, VlSideNavigationItem>>({});

const expandActiveSection = async () => {
  if (!props.autoExpand) return;
  const sections = props.sideNavigation.map((section) => section.ref);
  const expandSection = (sectionName: string) => {
    const sectionRef = sideNavigationRefs.value[sectionName];

    if (sectionRef && props.routeMatches.some((m) => m.name === sectionName)) {
      const toggle = sectionRef.$el?.querySelector('.vl-side-navigation__toggle');
      if (toggle) toggle.click();
    }
  };
  sections.forEach(expandSection);
};

onMounted(expandActiveSection);
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables.scss';

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
    cursor: pointer;

    :deep(.vl-side-navigation__toggle) {
      margin: 10px 0;
      text-decoration: none;
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
