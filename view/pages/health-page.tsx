import { Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { api } from '../client/client.service';
import ProgressBar from '../components/shared/progress-bar';

export const HealthPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: 'health',
    queryFn: api.getHealth,
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
