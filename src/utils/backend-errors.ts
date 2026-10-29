import { useUtilStore } from '@/core';
import type { AxiosError } from 'axios';

export interface IBackendError {
  message?: string;
  errors?: Record<string, string>[] | string[];
}

export const showBackendErrors = (
  backendError: AxiosError<IBackendError>,
  title?: string,
  clearNotification = false
) => {
  const { response } = backendError;
  const utilStore = useUtilStore();

  if (!response) {
    return;
  }

  if (clearNotification) {
    utilStore.toasts = [];
  }

  const errors = response.data.errors;

  if (!errors || !Array.isArray(errors) || errors.length === 0) {
    utilStore.addToast({
      title: title ?? 'Er is een fout opgetreden',
      content: response.data.message || 'Er ging iets mis, probeer het later opnieuw.',
      type: 'error',
    });
    return;
  }

  if (typeof errors[0] === 'object') {
    errors.forEach((error) => {
      Object.entries(error).forEach(([key, errorMessage]) => {
        utilStore.addToast({
          title: title ?? 'Er is een fout opgetreden',
          content: `${key}: ${errorMessage}`,
          type: 'error',
        });
      });
    });
    return;
  }

  utilStore.addToast({
    title: title ?? 'Er is een fout opgetreden',
    content: errors.join('<br><br>'),
    type: 'error',
  });
};
