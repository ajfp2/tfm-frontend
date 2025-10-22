export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number; // Duración en ms
  timestamp: Date;
}

export interface ToastOptions {
  title?: string;
  message: string;
  duration?: number;
  type?: ToastType;
}