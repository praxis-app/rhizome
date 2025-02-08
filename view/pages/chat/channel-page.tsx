import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../../client/api-client';
import ChatPanel from '../../components/channels/chat-panel';
import ProgressBar from '../../components/shared/progress-bar';

export const ChannelPage = () => {
  const { channelId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['channels', channelId],
    queryFn: () => api.getChannel(channelId!),
    enabled: !!channelId,
  });

  if (isLoading) {
    return <ProgressBar />;
  }

  if (!data) {
    return null;
  }

  return <ChatPanel channel={data.channel} />;
};
