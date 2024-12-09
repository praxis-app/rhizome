import axios from 'axios';
import { useQuery } from 'react-query';
import ProgressBar from '../components/shared/progress-bar';
import { useAppStore } from '../store/app.store';

export const HomePage = () => {
  const token = useAppStore((state) => state.token);

  const { data, isLoading } = useQuery({
    queryKey: 'health',
    queryFn: async () => {
      const result = await axios.get('/api/channels');
      return result.data;
    },
    enabled: !!token,
  });

  if (isLoading) {
    return <ProgressBar />;
  }

  if (!data) {
    return null;
  }

  return <>{JSON.stringify(data)}</>;
};
