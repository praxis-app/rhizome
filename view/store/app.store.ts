import { create } from 'zustand';
import { ToastNotification } from '../types/shared.types';

interface AppState {
  token: string | null;
  isAppLoading: boolean;
  imageCache: Record<string, string>;
  toast: ToastNotification | null;
  setToken(token: string | null): void;
  setIsAppLoading(isAppLoading: boolean): void;
  setImageCache(imageCache: Record<string, string>): void;
  setToast(toast: ToastNotification | null): void;
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  isAppLoading: true,
  imageCache: {},
  toast: null,

  setToken(token) {
    set({ token });
  },
  setIsAppLoading(isAppLoading) {
    set({ isAppLoading });
  },
  setImageCache(imageCache) {
    set({ imageCache });
  },
  setToast(toast) {
    set({ toast });
  },
}));
