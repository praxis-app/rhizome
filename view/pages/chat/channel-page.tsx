import { useQuery } from '@tanstack/react-query';
import { api } from '../../client/api-client';
import ChatPanel from '../../components/chat/chat-panel';
import ProgressBar from '../../components/shared/progress-bar';
import { useParams } from 'react-router-dom';

export const ChannelPage = () => {
  const { channelId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['channel', channelId],
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
