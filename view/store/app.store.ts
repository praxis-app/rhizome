import { create } from 'zustand';
import { ToastNotification } from '../types/shared.types';

interface AppState {
  isLoggedIn: boolean;
  isAppLoading: boolean;
  isNavDrawerOpen: boolean;
  toast: ToastNotification | null;
  setIsLoggedIn(isLoggedIn: boolean): void;
  setIsAppLoading(isAppLoading: boolean): void;
  setToast(toast: ToastNotification | null): void;
  setIsNavDrawerOpen(isNavDrawerOpen: boolean): void;
}

export const useAppStore = create<AppState>((set) => ({
  toast: null,
  isLoggedIn: false,
  isAppLoading: true,
  isNavDrawerOpen: false,

  setIsNavDrawerOpen(isNavDrawerOpen) {
    set({ isNavDrawerOpen });
  },
  setIsAppLoading(isAppLoading) {
    set({ isAppLoading });
  },
  setIsLoggedIn(isLoggedIn) {
    set({ isLoggedIn });
  },
  setToast(toast) {
    set({ toast });
  },
}));
