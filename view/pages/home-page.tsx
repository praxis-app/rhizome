import { useQuery } from 'react-query';
import { api } from '../client/client.service';
import ChatPanel from '../components/chat/chat-panel';
import ProgressBar from '../components/shared/progress-bar';

export const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: 'channels',
    queryFn: api.getChannels,
  });

  if (isLoading) {
    return <ProgressBar />;
  }

  if (!data) {
    return null;
  }

  return <ChatPanel />;
};
