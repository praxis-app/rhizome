import { create } from 'zustand';

interface AppState {
  token: string | null;
  isAppLoading: boolean;
  imageCache: Record<string, string>;
  setToken(token: string): void;
  setIsAppLoading(isAppLoading: boolean): void;
  setImageCache(imageCache: Record<string, string>): void;
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  isAppLoading: true,
  imageCache: {},

  setToken(token) {
    set({ token });
  },
  setIsAppLoading(isAppLoading) {
    set({ isAppLoading });
  },
  setImageCache(imageCache) {
    set({ imageCache });
  },
}));
