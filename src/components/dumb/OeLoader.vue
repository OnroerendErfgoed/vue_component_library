<template>
  <div>
    <DefineTemplate>
      <div
        class="spinner-content"
        :class="{
          'spinner-content--inline': props.modInline,
          'spinner-content--small': props.modInline && props.modSmall,
          'spinner-content--large': props.modInline && props.modLarge,
          'spinner-content--xlarge': props.modInline && props.modXLarge,
        }"
      >
        <font-awesome-icon class="spinner" :icon="['fas', 'spinner']" spin-pulse />
      </div>
    </DefineTemplate>

    <ReuseTemplate v-if="props.modInline" />

    <div v-else class="spinner-container">
      <div class="spinner-overlay">
        <ReuseTemplate />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createReusableTemplate } from '@vueuse/core';

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
const props = defineProps<{ modInline?: boolean; modSmall?: boolean; modLarge?: boolean; modXLarge?: boolean }>();
</script>

<style lang="scss" scoped>
.spinner-container div {
  z-index: 1001;
}
.spinner-overlay {
  background-color: rgba(152, 152, 152, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.spinner-content {
  display: table;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 3px;
  width: 100px;
  height: 100px;
  margin: auto;
  background: rgb(117, 63, 127);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;

  .spinner {
    position: absolute;
    top: 25%;
    left: 25%;
    font-size: 50px;
    color: rgb(255, 255, 255);
  }

  &--inline {
    box-shadow: none;
    width: 18px;
    height: 18px;
    background: rgb(117, 63, 127);
    position: relative;
    display: inline-block;
    top: 0;
    left: 0;
    padding: 0;
    margin: 0 0.5rem;
    transform: none;
    vertical-align: middle;

    .spinner {
      font-size: 16px;
      top: 0;
      left: 0;
    }
  }

  &--small {
    width: 14px;
    height: 14px;

    .spinner {
      font-size: 12px;
    }
  }

  &--large {
    width: 22px;
    height: 22px;

    .spinner {
      font-size: 20px;
    }
  }

  &--xlarge {
    width: 26px;
    height: 26px;

    .spinner {
      font-size: 24px;
    }
  }
}
</style>
