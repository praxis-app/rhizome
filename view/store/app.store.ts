import { create } from 'zustand';
import { ToastNotification } from '../types/shared.types';

interface AppState {
  token: string | null;
  isAppLoading: boolean;
  toast: ToastNotification | null;
  setToken(token: string | null): void;
  setIsAppLoading(isAppLoading: boolean): void;
  setToast(toast: ToastNotification | null): void;
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  isAppLoading: true,
  toast: null,

  setToken(token) {
    set({ token });
  },
  setIsAppLoading(isAppLoading) {
    set({ isAppLoading });
  },
  setToast(toast) {
    set({ toast });
  },
}));
