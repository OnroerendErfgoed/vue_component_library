<template>
  <div class="wizard">
    <div class="wizard__bar vl-u-spacer-top--medium vl-u-spacer--medium">
      <a
        v-for="(step, index) in props.steps"
        :key="index"
        class="wizard__bar-item vl-u-display-flex vl-u-flex-align-center vl-u-flex-v-center"
        :class="{ 'wizard__bar-item--current': index === currentStep }"
        @click="currentStep = index"
      >
        <vl-badge :initials="(index + 1).toString()" mod-border mod-small />
        <span class="wizard__bar-item-name">{{ step.name }}</span>
      </a>
    </div>

    <div
      v-for="(step, index) in steps"
      v-show="currentStep === index"
      :key="index"
      class="wizard__content vl-u-spacer--medium"
    >
      <slot :step="step" :current-step="currentStep" :total-steps="totalSteps"></slot>
    </div>

    <div class="wizard__actions vl-u-flex vl-u-flex-align-center">
      <vl-button v-if="currentStep > 0" class="vl-u-spacer-right--xsmall" mod-secondary @click="previousStep">
        <font-awesome-icon :icon="['fas', 'angles-left']" />
        Vorige
      </vl-button>
      <vl-button v-if="currentStep < totalSteps - 1" @click="nextStep">
        Volgende
        <font-awesome-icon :icon="['fas', 'angles-right']" />
      </vl-button>
      <vl-button v-else @click="nextStep">Verzend</vl-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VlBadge, VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IWizardProps } from '@models/wizard';

const props = withDefaults(defineProps<IWizardProps>(), {
  steps: () => [],
});

const currentStep = ref(0);
const totalSteps = ref(props.steps.length);

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

  .wizard__bar {
    width: 100%;
    height: 4rem;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;
    font-size: 18px;
    line-height: 1;

    .wizard__bar-item {
      flex: 1;
      display: inline-block;
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

      &:not(.wizard__bar-item--current):hover {
        background-color: $dark-purple;
        &:after {
          border-color: transparent transparent transparent $dark-purple;
        }
      }

      &:first-of-type {
        border-radius: 0.25rem 0 0 0.25rem;
      }

      &:last-of-type {
        border-radius: 0 0.25rem 0.25rem 0;
        margin-right: 0;
      }

      &:first-of-type:before,
      &:last-of-type:after {
        border-color: transparent !important;
      }
      .vl-badge {
        background-color: $primary-color;
        margin-left: 2rem;
        margin-right: 5px;
      }

      :deep(.vl-badge--border) {
        border: 2px solid $white;
      }

      :deep(.vl-badge--initials span) {
        color: $white;
      }

      @media screen and (max-width: 1024px) {
        .wizard__bar-item-name {
          display: none;
        }
      }

      &--current {
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
