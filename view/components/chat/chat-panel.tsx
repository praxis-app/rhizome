import { Box, debounce } from '@mui/material';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { api } from '../../client/api-client';
import { useSubscription } from '../../hooks/shared.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import { Channel, Message, MessagesQuery } from '../../types/chat.types';
import { PubSubMessage } from '../../types/shared.types';
import ChatTopNav from './chat-top-nav';
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
  channel: Channel;
}

const ChatPanel = ({ channel }: Props) => {
  const { isLoggedIn } = useAppStore((state) => state);

  const { data: meData } = useMeQuery({
    enabled: isLoggedIn,
  });

  const { data: messagesData, fetchNextPage } = useInfiniteQuery({
    queryKey: ['messages', channel.id],
    queryFn: ({ pageParam }) => {
      return api.getChannelMessages(channel.id, pageParam);
    },
    getNextPageParam: (_lastPage, pages) => {
      return pages.flatMap((page) => page.messages).length;
    },
    initialPageParam: 0,
  });

  const queryClient = useQueryClient();
  const feedBoxRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (feedBoxRef.current && feedBoxRef.current.scrollTop >= -200) {
      feedBoxRef.current.scrollTop = 0;
    }
  };

  useSubscription(`channel-${channel.id}-${meData?.user.id}`, {
    onMessage: (event) => {
      const { body }: PubSubMessage<NewMessagePayload | ImageMessagePayload> =
        JSON.parse(event.data);
      if (!body) {
        return;
      }

      // Update cache with new message, images are placeholders
      if (body.type === MessageType.MESSAGE) {
        queryClient.setQueryData<MessagesQuery>(
          ['messages', channel.id],
          (oldData) => {
            if (!oldData) {
              return {
                pages: [{ messages: [body.message] }],
                pageParams: [0],
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
            return { pages, pageParams: oldData.pageParams };
          },
        );
      }

      // Update cache with image status once uploaded
      if (body.type === MessageType.IMAGE) {
        queryClient.setQueryData<MessagesQuery>(
          ['messages', channel.id],
          (oldData) => {
            if (!oldData) {
              return { pages: [], pageParams: [] };
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

            return { pages, pageParams: oldData.pageParams };
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
      <ChatTopNav channel={channel} />
      <MessageFeed
        feedBoxRef={feedBoxRef}
        onLoadMore={debounce(fetchNextPage, 500)}
        messages={messagesData.pages.flatMap((page) => page.messages)}
      />
      <MessageForm channelId={channel.id} onSend={scrollToBottom} />
    </Box>
  );
};

export default ChatPanel;
