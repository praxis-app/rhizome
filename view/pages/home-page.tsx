import { useQuery } from 'react-query';
import { api } from '../client/api-client';
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

  // TODO: Add support for multiple channels
  const channelId = data.channels[0].id;

  return <ChatPanel channelId={channelId} />;
};
