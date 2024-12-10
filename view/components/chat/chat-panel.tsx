import { useQuery } from 'react-query';
import { api } from '../../client/api-client';
import MessageFeed from './message-feed';
import MessageForm from './message-form';

interface Props {
  channelId: number;
}

const ChatPanel = ({ channelId }: Props) => {
  const { data } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: () => api.getChannelMessages(channelId),
  });

  if (!data) {
    return null;
  }

  return (
    <>
      <MessageFeed messages={data.messages} />
      <MessageForm channelId={channelId} />
    </>
  );
};

export default ChatPanel;
