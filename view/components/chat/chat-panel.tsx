import { Box } from '@mui/material';
import { useRef } from 'react';
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
  isPlaceholder: false;
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
  const { data: meData } = useMeQuery();

  const feedBoxRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    if (feedBoxRef.current && feedBoxRef.current.scrollTop >= -100) {
      feedBoxRef.current.scrollTop = 0;
    }
  };

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
                    ? { ...image, isPlaceholder: body.isPlaceholder }
                    : image,
                ),
              };
            });
            return { messages };
          },
        );
      }

      scrollToBottom();
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
      <MessageFeed messages={messagesData.messages} feedBoxRef={feedBoxRef} />
      <MessageForm channelId={channelId} onSend={scrollToBottom} />
    </Box>
  );
};

export default ChatPanel;
