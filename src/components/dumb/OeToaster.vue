<!-- eslint-disable vue/no-v-html -->
<template>
  <vl-toaster mod-top-right>
    <vl-alert
      v-for="toast in store.toasts"
      :key="toast.id"
      mod-small
      :icon="toast.type === 'success' ? 'check' : 'warning'"
      :mod-error="toast.type === 'error'"
      :mod-success="toast.type === 'success'"
      :mod-warning="toast.type === 'warning'"
      mod-fade-out
      closable
      close-text="Toast sluiten"
      :title="toast.title"
      @close="store.removeToast(toast?.id as string)"
    >
      <ul v-if="Array.isArray(toast.content)">
        <li v-for="message in toast.content" :key="message">
          {{ message }}
        </li>
      </ul>
      <div v-else v-html="toast.content" />
    </vl-alert>
  </vl-toaster>
</template>

<script setup lang="ts">
import { VlAlert, VlToaster } from '@govflanders/vl-ui-design-system-vue3';
import { useUtilStore } from '@/composables';

const store = useUtilStore();
</script>
