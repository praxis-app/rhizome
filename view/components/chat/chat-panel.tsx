import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../client/api-client';
import { PubSubMessage, useSubscription } from '../../hooks/shared.hooks';
import { Message } from '../../types/chat.types';
import MessageFeed from './message-feed';
import MessageForm from './message-form';
import { useMeQuery } from '../../hooks/user.hooks';

interface Props {
  channelId: number;
}

const ChatPanel = ({ channelId }: Props) => {
  const { data: messagesData } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: () => api.getChannelMessages(channelId),
  });
  const { data: meData } = useMeQuery({ enabled: true });
  const queryClient = useQueryClient();

  useSubscription(`new-message-${channelId}-${meData?.user.id}`, {
    onMessage: (event) => {
      const { body }: PubSubMessage<{ message: Message }> = JSON.parse(
        event.data,
      );
      if (!body) {
        return;
      }
      queryClient.setQueryData<{ messages: Message[] }>(
        ['messages', channelId],
        (oldData) => ({
          messages: oldData
            ? [...oldData.messages, body.message]
            : [body.message],
        }),
      );
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
