import { create } from 'zustand';
import { ToastNotification } from '../types/shared.types';

interface AppState {
  isLoggedIn: boolean;
  isAppLoading: boolean;
  isNavDrawerOpen: boolean;
  navHeader: string | null;
  toast: ToastNotification | null;
  setIsLoggedIn(isLoggedIn: boolean): void;
  setIsAppLoading(isAppLoading: boolean): void;
  setToast(toast: ToastNotification | null): void;
  setIsNavDrawerOpen(isNavDrawerOpen: boolean): void;
  setNavHeader(navHeader: string | null): void;
}

export const useAppStore = create<AppState>((set) => ({
  toast: null,
  navHeader: null,
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
  setNavHeader(navHeader) {
    set({ navHeader });
  },
  setToast(toast) {
    set({ toast });
  },
}));
