<template>
  <div class="header">
    <div class="header__title">
      <h1 data-cy="application-name" class="vl-u-spacer-left--small" :title="appName">
        <vl-link :to="appUrl" exact>{{ appName }}</vl-link>
      </h1>
      <a title="Navigeer naar de officiële website van Onroerend Erfgoed" :href="props.logoUrl">
        <img
          data-cy="logo"
          class="header__logo vl-u-spacer-right--medium"
          src="@/assets/oe-logo.svg"
          alt="Logo Vlaanderen is erfgoed"
      /></a>
      <div class="triangle-placeholder"></div>
      <div class="header__actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="header__userinfo">
      <div class="triangle-placeholder triangle-placeholder--invert"></div>
      <div data-cy="username" class="username vl-u-spacer-left--large vl-u-spacer-right--small">
        <vl-dropdown-navigation
          :title="username"
          class="vl-u-spacer-bottom--none vl-col--12-12"
          :label="username"
          title-size="h5"
        >
          <vl-link-list mod-border>
            <vl-link-list-item title="Mijn profiel">
              <vl-link to="user" mod-block mod-bold>Mijn profiel</vl-link>
            </vl-link-list-item>
            <vl-link-list-item title="Wisselen">
              <vl-link to="wisselen" mod-block mod-bold>Wisselen</vl-link>
            </vl-link-list-item>
            <vl-link-list-item title="Afmelden">
              <vl-link to="afmelden" mod-block mod-bold mod-button>Afmelden</vl-link>
            </vl-link-list-item>
          </vl-link-list>
        </vl-dropdown-navigation>
        <small data-cy="role" class="vl-col--12-12 vl-u-text--small role" :title="role">{{ role }}</small>
      </div>
      <div v-if="showLogoutShortcut" class="logout">
        <vl-link title="Afmelden" to="afmelden" mod-icon-only icon="logout"></vl-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VlDropdownNavigation, VlLinkList, VlLinkListItem, VlLink } from '@govflanders/vl-ui-design-system-vue3';
import type { IHeaderProps } from '@models/header';

const props = withDefaults(defineProps<IHeaderProps>(), {
  logoUrl: 'https://www.onroerenderfgoed.be/',
  username: '',
  role: '',
  appName: '',
  appUrl: '/',
  showLogoutShortcut: false,
});
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/pyoes-settings';

.header {
  display: flex;
  width: 100%;
  height: 50px;
  margin: 0;
  background-color: $primary-color;
  justify-content: space-between;

  &__title {
    background-color: $white;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;

    a {
      display: flex;
    }

    h1 {
      font-size: 24px;
      padding-top: 50px;
      color: $primary-color;
      padding: 0;
      font-weight: 600;

      :deep(.vl-link) {
        text-decoration: none;
        color: $primary-color;
      }
    }
  }

  &__actions {
    :deep(.vl-button) {
      &:focus {
        outline: 3px solid $white;
      }
    }
  }

  &__logo {
    fill: $primary-color;
    padding: 0.5rem;
  }

  &__actions {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    color: $white;
    background-color: $primary-color;
  }

  &__userinfo {
    display: flex;
    color: $primary-color;
    margin-bottom: 0;
    background-color: $white;

    .username {
      :deep(.vl-dropdown-navigation .vl-popover) {
        top: 13px;
        z-index: 1000;
      }

      :deep(.vl-title) {
        text-overflow: ellipsis;
        max-width: 200px;
        min-width: 60px;
        white-space: nowrap;
        overflow: hidden;
      }

      .role {
        padding-right: 2.5rem;
        display: inline-block;
        text-overflow: ellipsis;
        max-width: 50px;
        white-space: nowrap;
        overflow: hidden;
      }

      & > * {
        padding-left: 0;
      }
    }

    .logout {
      display: flex;
      align-items: center;
      padding: 0 1rem;
      color: $white;
      background-color: $primary-color;

      :deep(.vl-icon) {
        color: $white;
      }
    }

    :deep(.vl-link) {
      color: $primary-color;
      text-align: center;

      & :visited {
        color: $primary-color;
      }
    }
  }
}

.triangle-placeholder {
  width: 0;
  border-top: 50px solid $primary-color;
  border-left: 20px solid rgba(0, 0, 0, 0);

  &--invert {
    width: 0;
    border-top: 0;
    border-left: 0;
    border-bottom: 50px solid $primary-color;
    border-right: 20px solid rgba(0, 0, 0, 0);
    float: left;
  }
}
</style>
