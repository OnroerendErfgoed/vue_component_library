<template>
  <div class="header vl-grid">
    <div class="header__title vl-col--9-12 vl-col--12-12--m">
      <div class="heading vl-u-flex vl-u-flex-v-center">
        <h1 data-cy="application-name" class="vl-u-spacer-left--small" :title="appName">
          <vl-link :href="appUrl" exact>{{ appName }}</vl-link>
        </h1>
        <a title="Navigeer naar de officiële website van Onroerend Erfgoed" :href="props.logoUrl">
          <img
            data-cy="logo"
            class="header__logo vl-u-spacer-right--medium"
            src="@/assets/oe-logo.svg"
            alt="Logo Vlaanderen is erfgoed"
        /></a>
      </div>
      <div class="triangle-placeholder"></div>
      <div class="header__actions" data-cy="header-actions">
        <slot name="actions"></slot>
      </div>
      <div class="triangle-placeholder triangle-placeholder--invert"></div>
    </div>
    <div class="header__userinfo vl-col--3-12 vl-col--12-12--m vl-u-flex-align-flex-end">
      <div v-if="user" data-cy="user" class="user vl-u-spacer-left--large vl-u-spacer-right--small">
        <vl-dropdown-navigation
          data-cy="dropdown-navigation"
          :title="user.name"
          class="vl-u-spacer-bottom--none vl-col--12-12 vl-u-flex-v-baseline"
          :label="user.name"
          title-size="h5"
        >
          <vl-link-list data-cy="navigation-list" mod-border>
            <vl-link-list-item data-cy="navigation-profile" title="Ga naar mijn gegevens">
              <vl-link :href="props.profileUrl" mod-block mod-bold>Mijn profiel</vl-link>
            </vl-link-list-item>
            <vl-link-list-item data-cy="navigation-change" title="Wissel van profiel">
              <vl-link :href="props.changeUrl" mod-block mod-bold>Wisselen</vl-link>
            </vl-link-list-item>
            <vl-link-list-item data-cy="navigation-logout" title="Meld je af">
              <vl-link :href="props.logoutUrl" mod-block mod-bold mod-button>Afmelden</vl-link>
            </vl-link-list-item>
          </vl-link-list>
        </vl-dropdown-navigation>
        <small data-cy="role" class="vl-col--12-12 vl-u-text--small role" :title="user.role">{{ user.role }}</small>
      </div>
      <div v-else class="login">
        <vl-link
          data-cy="login"
          class="vl-u-spacer-left--medium vl-u-spacer-right--medium"
          title="Aanmelden"
          :href="props.loginUrl"
          >Aanmelden</vl-link
        >
      </div>
      <div v-if="user && showLogoutShortcut" data-cy="logout-shortcut" class="logout">
        <vl-link title="Afmelden" :href="props.logoutUrl" mod-icon-only icon="logout"></vl-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VlDropdownNavigation, VlLink, VlLinkList, VlLinkListItem } from '@govflanders/vl-ui-design-system-vue3';
import { IHeaderProps } from '@/core';

const props = withDefaults(defineProps<IHeaderProps>(), {
  user: undefined,
  logoUrl: 'https://www.onroerenderfgoed.be/',
  appName: '',
  appUrl: '/',
  profileUrl: '/profiel',
  changeUrl: '/wisselen?goto=/aanmelden',
  logoutUrl: '/afmelden',
  loginUrl: '/aanmelden',
  showLogoutShortcut: false,
});
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables';

.vl-grid {
  margin-left: 0;
  > * {
    padding-left: 0;
  }
}

.header {
  display: flex;
  width: 100%;
  height: fit-content;
  margin: 0;
  background-color: $primary-color;
  justify-content: space-between;

  :deep(.vl-link) {
    text-decoration: none;
    color: $primary-color;
  }

  &__title {
    height: 50px;
    background-color: $white;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;

    .heading {
      height: 50px;
    }

    a {
      display: flex;
    }

    h1 {
      font-size: 24px;
      color: $primary-color;
      padding: 0;
      font-weight: 600;
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
    height: 55px;
    fill: $primary-color;
    padding: 0.5rem;
  }

  &__actions {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    padding: 0 1rem;

    color: $white;
    background-color: $primary-color;
  }

  &__userinfo {
    display: flex;
    height: 50px;
    color: $primary-color;
    margin-bottom: 0;
    background-color: $white;

    .user {
      :deep(.vl-dropdown-navigation .vl-popover) {
        top: 13px;
        z-index: 1000;
      }

      :deep(.vl-title) {
        text-overflow: ellipsis;
        max-width: 200px;
        min-width: 120px;
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

    .login {
      display: flex;
      align-items: center;
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

@media screen and (max-width: 1023px) {
  .header {
    justify-content: flex-end;
  }
  .header__title {
    flex-direction: column;
    height: auto;

    .heading {
      width: 100%;
    }
  }

  .header__actions {
    position: absolute;
    z-index: 1;
    top: 50px;
    height: 50px;
    width: 100%;
    justify-content: flex-start;
  }

  .header__userinfo {
    color: $white;

    .user {
      z-index: 1000;

      :deep(.vl-title) {
        color: $white;
      }
    }

    :deep(.login .vl-link),
    :deep(.logout .vl-link) {
      z-index: 2;
      color: $white;
      text-align: center;

      & :visited {
        color: $white;
      }
    }
  }

  .triangle-placeholder {
    display: none;
  }
}

@media screen and (max-width: 767px) {
  .header__title {
    .heading {
      h1 {
        font-size: 16px;
      }
    }
  }
}
</style>
