import { Box, debounce } from '@mui/material';
import { useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { api } from '../../client/api-client';
import { useSubscription } from '../../hooks/shared.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import { Message, MessagesQuery } from '../../types/chat.types';
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
  const { token } = useAppStore((state) => state);

  const { data: messagesData, fetchNextPage } = useInfiniteQuery({
    queryKey: ['messages', channelId],
    queryFn: ({ pageParam }) => {
      return api.getChannelMessages(channelId, pageParam);
    },
    getNextPageParam: (_lastPage, pages) => {
      return pages.flatMap((page) => page.messages).length;
    },
  });
  const { data: meData } = useMeQuery({ enabled: !!token });

  const feedBoxRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    if (feedBoxRef.current && feedBoxRef.current.scrollTop >= -200) {
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

      // Update cache with new message, images are placeholders
      if (body.type === MessageType.MESSAGE) {
        queryClient.setQueryData<MessagesQuery>(
          ['messages', channelId],
          (oldData) => {
            if (!oldData) {
              return {
                pages: [{ messages: [body.message] }],
              };
            }
            const pages = oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  messages: [body.message, ...page.messages],
                };
              }
              return page;
            });
            return { pages };
          },
        );
      }

      // Update cache with image status once uploaded
      if (body.type === MessageType.IMAGE) {
        queryClient.setQueryData<MessagesQuery>(
          ['messages', channelId],
          (oldData) => {
            if (!oldData) {
              return { pages: [] };
            }

            const pages = oldData.pages.map((page) => {
              const messages = page.messages.map((message) => {
                if (message.id !== body.messageId || !message.images) {
                  return message;
                }
                const images = message.images.map((image) => {
                  if (image.id !== body.imageId) {
                    return image;
                  }
                  return { ...image, isPlaceholder: false };
                });
                return { ...message, images };
              });
              return { messages };
            });

            return { pages };
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
      <MessageFeed
        feedBoxRef={feedBoxRef}
        onLoadMore={debounce(fetchNextPage, 500)}
        messages={messagesData.pages.flatMap((page) => page.messages)}
      />
      <MessageForm channelId={channelId} onSend={scrollToBottom} />
    </Box>
  );
};

export default ChatPanel;
