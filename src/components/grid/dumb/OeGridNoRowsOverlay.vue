<template>
  <div data-cy="ag-overlay" class="ag-overlay-loading-center">
    <FontAwesomeIcon data-cy="warning-icon" :icon="faCircleExclamation" />
    {{ props.params.noRowsMessage }}
  </div>
</template>

<script setup lang="ts">
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps<{ params: { noRowsMessage: string } }>();
</script>
