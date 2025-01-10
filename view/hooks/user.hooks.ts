import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from '../client/api-client';
import { useAppStore } from '../store/app.store';
import { CurrentUser } from '../types/user.types';

export const useMeQuery = (
  options?: Omit<UseQueryOptions<{ user: CurrentUser }>, 'queryKey'>,
) => {
  const { setIsAppLoading, setIsLoggedIn } = useAppStore((state) => state);

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const me = await api.getCurrentUser();
        setIsLoggedIn(true);
        return me;
      } catch (error) {
        localStorage.removeItem('access_token');
        throw error;
      } finally {
        setIsAppLoading(false);
      }
    },
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    ...options,
  });
};
