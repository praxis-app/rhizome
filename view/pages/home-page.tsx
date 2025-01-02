import { useQuery } from '@tanstack/react-query';
import { api } from '../client/api-client';
import ChatPanel from '../components/chat/chat-panel';
import ProgressBar from '../components/shared/progress-bar';

export const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: api.getChannels,
  });

  if (isLoading) {
    return <ProgressBar />;
  }

  if (!data) {
    return null;
  }

  // TODO: Add support for multiple channels
  const channel = data.channels[0];

  return <ChatPanel channel={channel} />;
};
