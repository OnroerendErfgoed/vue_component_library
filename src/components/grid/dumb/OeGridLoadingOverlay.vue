<template>
  <div data-cy="ag-overlay" class="ag-overlay-loading-center">
    <FontAwesomeIcon data-cy="spinner-icon" :icon="faSpinner" spin-pulse />
    {{ props.params.loadingMessage }}
  </div>
</template>

<script setup lang="ts">
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps<{ params: { loadingMessage: string } }>();
</script>
