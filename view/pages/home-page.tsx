import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../client/api-client';
import ProgressBar from '../components/shared/progress-bar';

/**
 * Home page component. Redirects to the general channel page.
 */
export const HomePage = () => {
  // TODO: Use `redirect` instead of `navigate`
  const navigate = useNavigate();

  useQuery({
    queryKey: ['general-channel'],
    queryFn: async () => {
      const result = await api.getGeneralChannel();
      navigate(`/channels/${result.channel.id}`);
      return result;
    },
  });

  return <ProgressBar />;
};
