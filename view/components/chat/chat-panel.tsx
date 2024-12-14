import { useQuery } from 'react-query';
import { api } from '../../client/api-client';
import MessageFeed from './message-feed';
import MessageForm from './message-form';
import { PubSubMessage, useSubscription } from '../../hooks/shared.hooks';

interface Props {
  channelId: number;
}

const ChatPanel = ({ channelId }: Props) => {
  const { data: messagesData } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: () => api.getChannelMessages(channelId),
  });

  const { data: meData } = useQuery('me', api.getCurrentUser);

  // TODO: Include user ID in channel key
  useSubscription(`new-message-${channelId}`, {
    onMessage: (event) => {
      const { body }: PubSubMessage<any> = JSON.parse(event.data);
      console.log('New message:', body);
    },
    enabled: !!meData,
  });

  if (!messagesData) {
    return null;
  }

  return (
    <>
      <MessageFeed messages={messagesData.messages} />
      <MessageForm channelId={channelId} />
    </>
  );
};

export default ChatPanel;
