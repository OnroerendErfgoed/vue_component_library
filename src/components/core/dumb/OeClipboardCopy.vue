<template>
  <div class="vl-u-display-inline-block">
    <FontAwesomeIcon v-if="!copied" class="clipboard" :icon="faClipboard" @click="copy(value)" />
    <FontAwesomeIcon v-else class="check" :icon="faCheck" />
  </div>
</template>

<script setup lang="ts">
import { faCheck, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useClipboard } from '@vueuse/core';

defineProps<{ value: string }>();
const { copy, copied } = useClipboard();
</script>

<style lang="scss" scoped>
@import '@OnroerendErfgoed/pyoes/scss/base-variables';

.clipboard {
  color: $primary-color;
  cursor: pointer;
}

.check {
  color: $success-color;
}
</style>
