import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface UIState {
  toasts: ToastMessage[];
  isAddComponentModalOpen: boolean;
  selectedComponentForAdd: string | null;

  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  openAddComponentModal: (componentId?: string) => void;
  closeAddComponentModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  isAddComponentModalOpen: false,
  selectedComponentForAdd: null,

  showToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id, duration: toast.duration || 4000 };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, newToast.duration);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  openAddComponentModal: (componentId) => {
    set({ isAddComponentModalOpen: true, selectedComponentForAdd: componentId || null });
  },

  closeAddComponentModal: () => {
    set({ isAddComponentModalOpen: false, selectedComponentForAdd: null });
  },
}));
