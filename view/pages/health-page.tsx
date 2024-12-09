import { Typography } from '@mui/material';
import axios from 'axios';
import { useQuery } from 'react-query';
import ProgressBar from '../components/shared/progress-bar';
import { useAppStore } from '../store/app.store';

export const HealthPage = () => {
  const token = useAppStore((state) => state.token);

  const { data, isLoading } = useQuery({
    queryKey: 'health',
    queryFn: async () => {
      const result = await axios.get<{ timestamp: string }>('/api/health');
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

  return (
    <Typography
      position="fixed"
      bottom={10}
      right={10}
      height={10}
      fontSize="8px"
      color="text.secondary"
      borderRadius="2px"
      paddingX={0.3}
    >
      {data.timestamp}
    </Typography>
  );
};
