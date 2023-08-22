<template>
  <div class="clipboard-copy-container">
    <font-awesome-icon v-if="!showCheck" class="clipboard" :icon="['fa-solid', 'clipboard']" @click="clipboardClick" />
    <font-awesome-icon v-if="showCheck" class="check" :icon="['fa-solid', 'check']" />
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import { toClipboard } from '@soerenmartius/vue3-clipboard';

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
.clipboard {
  color: #944ea1;
  cursor: pointer;
}

.check {
  color: #43ac6a;
}

.clipboard-copy-container {
  display: inline-block;
}
</style>
