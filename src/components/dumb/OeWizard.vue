<template>
  <div class="wizard">
    <div class="wizard__bar vl-u-spacer-top--medium vl-u-spacer--medium" data-cy="wizard-bar">
      <a
        v-for="(step, index) in props.steps"
        :key="index"
        :data-cy="`step-${index + 1}`"
        class="wizard__bar-item vl-u-display-flex vl-u-flex-align-center vl-u-flex-v-center"
        :class="{
          'wizard__bar-item--current': index === currentStep,
          'wizard__bar-item--bar-navigation-allowed': props.allowBarNavigation,
        }"
        @click="goToStep(index)"
      >
        <vl-badge v-vl-tooltip="step.name" :initials="(index + 1).toString()" mod-border mod-small />
        <span class="wizard__bar-item-name">{{ step.name }}</span>
      </a>
    </div>

    <div class="wizard__content vl-u-spacer--medium" :data-cy="`step-${currentStep + 1}-content`">
      <slot :current-step="currentStep" :total-steps="totalSteps"></slot>
    </div>

    <div class="wizard__actions vl-u-flex vl-u-flex-align-center">
      <vl-button
        v-if="currentStep > 0"
        data-cy="previous-step-button"
        class="wizard__navigation-button vl-u-spacer-right--xsmall"
        mod-secondary
        @click="previousStep"
      >
        <font-awesome-icon :icon="['fas', 'angles-left']" />
        Vorige
      </vl-button>
      <vl-button
        v-if="currentStep < totalSteps - 1"
        :mod-disabled="steps[currentStep].nextStepDisabled"
        class="wizard__navigation-button"
        data-cy="next-step-button"
        @click="nextStep"
      >
        Volgende
        <font-awesome-icon :icon="['fas', 'angles-right']" />
      </vl-button>
      <vl-button
        v-else
        :mod-disabled="submitDisabled"
        class="wizard__navigation-button"
        data-cy="submit-button"
        @click="submit"
        >Verzend</vl-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { VlBadge, VlButton } from '@govflanders/vl-ui-design-system-vue3';
import { computedAsync } from '@vueuse/core';
import { ref, watch } from 'vue';
import type { IWizardProps } from '@models/wizard';

// Next line should be activated once VlUTooltip is properly exported
// For now, an import of { VlUiUtil } in the implementing app also makes the tooltip available
// import { VlUTooltip } from '@govflanders/vl-ui-design-system-vue3';

const props = withDefaults(defineProps<IWizardProps>(), {
  steps: () => [],
  allowBarNavigation: false,
  disableSubmitWhenInvalid: false,
});
const emit = defineEmits(['step-changed', 'submit', 'go-to-step']);

const currentStep = ref(0);
const totalSteps = ref(props.steps.length);

const submitDisabled = computedAsync(
  async () => {
    if (props.disableSubmitWhenInvalid) {
      return !(await props.steps[totalSteps.value - 1].validate()).valid;
    }
    return false;
  },
  false,
  { lazy: true }
);

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const nextStep = async () => {
  if (currentStep.value < totalSteps.value - 1 && (await props.steps[currentStep.value].validate()).valid) {
    currentStep.value++;
  }
};

const goToStep = async (step: number) => {
  emit('go-to-step', step);
  if (props.allowBarNavigation && (step < currentStep.value || (await previousStepsAreValid(step)))) {
    currentStep.value = step;
  }
};

const submit = async () => {
  if ((await props.steps[totalSteps.value - 1].validate()).valid) {
    emit('submit');
  }
};

const previousStepsAreValid = async (step: number) => {
  const steps = props.steps.slice(0, step);
  const validations = await Promise.all(steps.map((s) => s.validate()));

  return validations.every((v) => v.valid);
};

const reset = () => (currentStep.value = 0);

watch(
  () => currentStep.value,
  () => emit('step-changed', currentStep.value)
);

defineExpose({ reset, previousStep, nextStep, goToStep, submit });
</script>

<style lang="scss" scoped>
@import 'pyoes/scss/base-variables';

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
        background-color: $very-dark-purple;
        color: $white;
        cursor: default;

        &:after {
          border-color: transparent transparent transparent $very-dark-purple;
        }

        .vl-badge {
          background-color: $very-dark-purple;
        }
      }

      &--bar-navigation-allowed {
        cursor: pointer;

        &:not(.wizard__bar-item--current):hover {
          background-color: $dark-purple;
          &:after {
            border-color: transparent transparent transparent $dark-purple;
          }
        }
      }
    }
  }

  :deep(.wizard__navigation-button) {
    display: flex;
    justify-content: center;
    width: 130px;
  }
}
</style>
