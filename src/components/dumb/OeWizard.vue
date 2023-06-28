<template>
  <div class="wizard">
    <div class="wizardbar">
      <a
        v-for="(step, index) in steps"
        :key="index"
        class="wizardbar__item vl-u-display-flex vl-u-flex-align-center vl-u-flex-v-center"
        :class="{ current: index === currentStep }"
        @click="currentStep = index"
      >
        <vl-badge :initials="index + 1" mod-border mod-small />
        <span>{{ step }}</span>
      </a>
    </div>

    <div v-for="(step, index) in steps" v-show="currentStep === index" :key="index">
      <slot :step="step" :current-step="currentStep" :total-steps="totalSteps"></slot>
    </div>
    <div class="vl-u-flex vl-u-flex-align-center">
      <vl-button v-if="currentStep > 0" class="vl-u-spacer-right--xsmall" mod-secondary @click="previousStep"
        >Vorige</vl-button
      >
      <vl-button v-if="currentStep < totalSteps - 1" @click="nextStep">Volgende</vl-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VlBadge, VlButton } from '@govflanders/vl-ui-design-system-vue3';

const steps = ref(['Gegevens EPC', 'Mijn gegevens', 'Bijlagen', 'Overzicht']);
const currentStep = ref(0);
const totalSteps = ref(steps.value.length);

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const nextStep = () => {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++;
  }
};
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/pyoes-settings';

.wizard {
  width: 100%;

  .wizardbar {
    width: 100%;
    height: 4rem;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;
    font-size: 18px;
    line-height: 1;
    margin: 50px 0;

    &__item {
      flex: 1;
      display: inline-block;
      padding: 0.5rem 0.8rem;
      padding-left: 1.8rem;
      text-decoration: none;
      transition: all 0.15s;
      background-color: $primary-color;
      color: $white;
      text-align: center;
      position: relative;
      margin-right: 5px;
      cursor: pointer;

      &:before {
        border-color: transparent transparent transparent white;
        left: 0;
      }

      &:after {
        border-color: transparent transparent transparent $primary-color;
        left: 100%;
        z-index: 1;
      }

      &:before,
      &:after {
        content: '';
        height: 0;
        width: 0;
        border-width: 2rem 0 2rem 2rem;
        border-style: solid;
        transition: all 0.15s;
        position: absolute;
        top: 0;
      }

      &:not(.current):hover {
        background-color: $dark-purple;
        &:after {
          border-color: transparent transparent transparent $dark-purple;
        }
      }

      &:first-of-type {
        border-radius: 0.25rem 0 0 0.25rem;
        padding-left: 1.3rem;
      }

      &:last-of-type {
        border-radius: 0 0.25rem 0.25rem 0;
        padding-right: 1.3rem;
      }

      &:first-of-type:before,
      &:last-of-type:after {
        border-color: transparent !important;
      }
      .vl-badge {
        background-color: $primary-color;
        margin-right: 5px;
      }

      :deep(.vl-badge--border) {
        border: 2px solid $white;
      }

      :deep(.vl-badge--initials span) {
        color: $white;
      }

      &.current {
        background-color: $black;
        color: $white;
        cursor: default;

        &:after {
          border-color: transparent transparent transparent $black;
        }

        .vl-badge {
          background-color: $black;
        }
      }
    }
  }
}
</style>
