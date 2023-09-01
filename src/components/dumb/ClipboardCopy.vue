<template>
  <div class="vl-u-display-inline-block">
    <font-awesome-icon v-if="!showCheck" class="clipboard" :icon="['fa-solid', 'clipboard']" @click="clipboardClick" />
    <font-awesome-icon v-else class="check" :icon="['fa-solid', 'check']" />
  </div>
</template>

<script setup lang="ts">
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
@import 'pyoes/scss/base-variables';

.clipboard {
  color: $primary-color;
  cursor: pointer;
}

.check {
  color: $success-color;
}
</style>
