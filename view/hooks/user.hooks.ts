import { useQuery, UseQueryOptions } from 'react-query';
import { api } from '../client/api-client';
import { CurrentUser } from '../types/user.types';

export const useMeQuery = (
  options?: Omit<UseQueryOptions<{ user: CurrentUser }>, 'queryKey'>,
) => useQuery('me', api.getCurrentUser, options);
