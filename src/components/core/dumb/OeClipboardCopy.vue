<template>
  <div class="vl-u-display-inline-block">
    <FontAwesomeIcon v-if="!showCheck" class="clipboard" :icon="faClipboard" @click="clipboardClick" />
    <FontAwesomeIcon v-else class="check" :icon="faCheck" />
  </div>
</template>

<script setup lang="ts">
import { faCheck, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { toClipboard } from '@soerenmartius/vue3-clipboard';
import { ref } from 'vue';

const props = defineProps<{ value: string }>();
const showCheck = ref(false);
const clipboardClick = () => {
  toClipboard(props.value);
  showCheck.value = true;

  setTimeout(() => {
    showCheck.value = false;
  }, 1000);
};
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
