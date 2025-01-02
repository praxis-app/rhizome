import { create } from 'zustand';
import { ToastNotification } from '../types/shared.types';

interface AppState {
  isLoggedIn: boolean;
  isAppLoading: boolean;
  toast: ToastNotification | null;
  setIsLoggedIn(isLoggedIn: boolean): void;
  setIsAppLoading(isAppLoading: boolean): void;
  setToast(toast: ToastNotification | null): void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  isAppLoading: true,
  toast: null,

  setIsLoggedIn(isLoggedIn) {
    set({ isLoggedIn });
  },
  setIsAppLoading(isAppLoading) {
    set({ isAppLoading });
  },
  setToast(toast) {
    set({ toast });
  },
}));
