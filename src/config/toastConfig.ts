type ToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';

interface ToastStyle {
  position: ToastPosition;
  duration: number;
  style: {
    background: string;
    color: string;
  };
}

interface ToastConfig {
  success: ToastStyle;
  error: ToastStyle;
}

export const toastConfig: ToastConfig = {
  success: {
    position: 'top-right',
    duration: 2000,
    style: {
      background: '#4CAF50',
      color: '#fff',
    },
  },
  error: {
    position: 'top-right',
    duration: 2000,
    style: {
      background: '#ef4444',
      color: '#fff',
    },
  }
}; 