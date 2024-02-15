import { Guid } from 'guid-typescript';
import { remove } from 'lodash';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { IToast } from '@models/toast';

export const useUtilStore = defineStore('util', () => {
  // Loading
  const loading = ref<string[]>([]);
  const isLoading = computed(() => !!loading.value.length);

  const startLoading = (reference: string) => loading.value.push(reference);
  const stopLoading = (reference: string) => remove(loading.value, (l) => l === reference);

  // Toasts
  const toasts = ref<IToast[]>([]);
  const addToast = (toast: IToast, duration?: number) => {
    const id = Guid.create().toString();
    toasts.value.push({ ...toast, id });

    if (duration) {
      setTimeout(() => removeToast(id), duration);
    }
  };
  const removeToast = (id: string) => remove(toasts.value, (e) => e.id === id);

  return {
    toasts,
    addToast,
    removeToast,
    loading,
    isLoading,
    startLoading,
    stopLoading,
  };
});
