<template>
  <div>
    <DefineTemplate>
      <slot />
      <div
        class="loader-content"
        :class="{
          'loader-content--inline': props.modInline,
          'loader-content--small': props.modInline && props.modSmall,
          'loader-content--large': props.modInline && props.modLarge,
          'loader-content--xlarge': props.modInline && props.modXLarge,
        }"
      >
        <FontAwesomeIcon class="loader" :icon="faSpinner" spin-pulse />
      </div>
    </DefineTemplate>

    <ReuseTemplate v-if="props.modInline" />

    <div v-else class="loader-container">
      <div class="loader-overlay">
        <ReuseTemplate />
        <div v-if="props.title" class="title">
          {{ props.title }}
          <div v-if="props.subTitle" class="title__sub">
            {{ props.subTitle }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createReusableTemplate } from '@vueuse/core';

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
const props = defineProps<{
  modInline?: boolean;
  modSmall?: boolean;
  modLarge?: boolean;
  modXLarge?: boolean;
  title?: string;
  subTitle?: string;
}>();
</script>

<style lang="scss" scoped>
@import '@OnroerendErfgoed/pyoes/scss/base-variables';

.loader-container div {
  z-index: 1001;
}
.loader-overlay {
  background-color: rgba(152, 152, 152, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.loader-content {
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 100px;
  height: 100px;
  margin: auto;
  background: $dark-purple;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  border-radius: 50px;

  .loader {
    font-size: 50px;
    color: rgb(255, 255, 255);
  }

  &--inline {
    box-shadow: none;
    width: 18px;
    height: 18px;
    background: $dark-purple;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    padding: 0;
    margin: 0 0.5rem;
    transform: none;
    vertical-align: middle;

    .loader {
      font-size: 16px;
    }
  }

  &--small {
    width: 14px;
    height: 14px;

    .loader {
      font-size: 12px;
    }
  }

  &--large {
    width: 22px;
    height: 22px;

    .loader {
      font-size: 20px;
    }
  }

  &--xlarge {
    width: 26px;
    height: 26px;

    .loader {
      font-size: 24px;
    }
  }
}

.title {
  margin-top: 100px;
  text-align: center;
  color: $dark-purple;
  font-weight: 600;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;

  .title__sub {
    font-weight: 400;
    position: relative;
  }
}
</style>
