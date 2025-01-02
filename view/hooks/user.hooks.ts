import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from '../client/api-client';
import { CurrentUser } from '../types/user.types';
import { useAppStore } from '../store/app.store';

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
        localStorage.removeItem('token');
        throw error;
      } finally {
        setIsAppLoading(false);
      }
    },
    ...options,
  });
};
