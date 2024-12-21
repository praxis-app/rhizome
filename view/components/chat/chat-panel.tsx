import { Box } from '@mui/material';
import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../client/api-client';
import { useSubscription } from '../../hooks/shared.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { Message } from '../../types/chat.types';
import { PubSubMessage } from '../../types/shared.types';
import MessageFeed from './message-feed';
import MessageForm from './message-form';

enum MessageType {
  MESSAGE = 'message',
  IMAGE = 'image',
}

interface NewMessagePayload {
  type: MessageType.MESSAGE;
  message: Message;
}

interface ImageMessagePayload {
  type: MessageType.IMAGE;
  filename: string;
  messageId: string;
  imageId: string;
}

interface Props {
  channelId: string;
}

const ChatPanel = ({ channelId }: Props) => {
  const { data: messagesData } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: () => api.getChannelMessages(channelId),
  });
  const { data: meData } = useMeQuery({ enabled: true });
  const queryClient = useQueryClient();

  useSubscription(`channel-${channelId}-${meData?.user.id}`, {
    onMessage: (event) => {
      const { body }: PubSubMessage<NewMessagePayload | ImageMessagePayload> =
        JSON.parse(event.data);
      if (!body) {
        return;
      }

      // Update cache with new message
      if (body.type === MessageType.MESSAGE) {
        queryClient.setQueryData<{ messages: Message[] }>(
          ['messages', channelId],
          (oldData) => ({
            messages: oldData
              ? [body.message, ...oldData.messages]
              : [body.message],
          }),
        );
      }

      // Update cache with image filename once uploaded
      if (body.type === MessageType.IMAGE) {
        queryClient.setQueryData<{ messages: Message[] }>(
          ['messages', channelId],
          (oldData) => {
            if (!oldData) {
              return { messages: [] };
            }
            const messages = oldData.messages.map((message) => {
              if (message.id !== body.messageId) {
                return message;
              }
              return {
                ...message,
                images: message.images?.map((image) =>
                  image.id === body.imageId
                    ? { ...image, filename: body.filename }
                    : image,
                ),
              };
            });
            return { messages };
          },
        );
      }
    },
    enabled: !!meData,
  });

  if (!messagesData) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      position="fixed"
      top={0}
      left={0}
      bottom={0}
      right={0}
    >
      <MessageFeed messages={messagesData.messages} />
      <MessageForm channelId={channelId} />
    </Box>
  );
};

export default ChatPanel;
