import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../client/api-client';
import { PubSubMessage, useSubscription } from '../../hooks/shared.hooks';
import MessageFeed from './message-feed';
import MessageForm from './message-form';

interface Props {
  channelId: number;
}

const ChatPanel = ({ channelId }: Props) => {
  const { data: messagesData } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: () => api.getChannelMessages(channelId),
  });
  const { data: meData } = useQuery('me', api.getCurrentUser);
  const queryClient = useQueryClient();

  useSubscription(`new-message-${channelId}-${meData?.user.id}`, {
    onMessage: (event) => {
      const { body }: PubSubMessage<{ message: any }> = JSON.parse(event.data);
      if (!body) {
        return;
      }
      queryClient.setQueryData(['messages', channelId], (oldData: any) => ({
        messages: [...oldData.messages, body.message],
      }));
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
