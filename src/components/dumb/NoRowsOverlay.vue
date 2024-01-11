<template>
  <div class="ag-overlay-loading-center">
    <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
    {{ props.params.noRowsMessage }}
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps<{ params: { noRowsMessage: string } }>();
</script>
