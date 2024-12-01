import { create } from 'zustand';

interface AppState {
  token: string | null;
  isAppLoading: boolean;
  setToken(token: string): void;
  setIsAppLoading(isAppLoading: boolean): void;
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  isAppLoading: true,

  setToken(token) {
    set({ token });
  },
  setIsAppLoading(isAppLoading) {
    set({ isAppLoading });
  },
}));
