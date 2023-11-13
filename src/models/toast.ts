export interface IToast {
  id?: string;
  type: ToastType;
  title: string;
  content: string | string[];
}

export type ToastType = 'default' | 'error' | 'success' | 'warning';
