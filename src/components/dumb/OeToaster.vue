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
      <template v-if="typeof toast.content === 'string'">
        {{ toast.content }}
      </template>
      <template v-else>
        <ul>
          <li v-for="message in toast.content" :key="message">
            {{ message }}
          </li>
        </ul>
      </template>
    </vl-alert>
  </vl-toaster>
</template>

<script setup lang="ts">
import { VlAlert, VlToaster } from '@govflanders/vl-ui-design-system-vue3';
import { useUtilStore } from '@/composables';

const store = useUtilStore();
</script>
