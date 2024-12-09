import { useQuery } from 'react-query';
import { apiClient } from '../client/api-client';
import ProgressBar from '../components/shared/progress-bar';

export const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: 'channels',
    queryFn: apiClient.getChannels,
  });

  if (isLoading) {
    return <ProgressBar />;
  }

  if (!data) {
    return null;
  }

  return <>{JSON.stringify(data)}</>;
};
