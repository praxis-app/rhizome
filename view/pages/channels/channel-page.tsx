import { Box, debounce } from '@mui/material';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../client/api-client';
import ChannelLeftNav from '../../components/channels/channel-left-nav';
import ChannelTopNav from '../../components/channels/channel-top-nav';
import MessageFeed from '../../components/messages/message-feed';
import MessageForm from '../../components/messages/message-form';
import ProgressBar from '../../components/shared/progress-bar';
import { useAboveBreakpoint, useSubscription } from '../../hooks/shared.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import { Message, MessagesQuery } from '../../types/channel.types';
import { PubSubMessage } from '../../types/shared.types';

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

export const ChannelPage = () => {
  const { isLoggedIn } = useAppStore((state) => state);

  const { channelId } = useParams();
  const queryClient = useQueryClient();
  const feedBoxRef = useRef<HTMLDivElement>(null);
  const isAboveMd = useAboveBreakpoint('md');

  const { data: meData } = useMeQuery({
    enabled: isLoggedIn,
  });

  const { data: channelData, isLoading } = useQuery({
    queryKey: ['channels', channelId],
    queryFn: () => api.getChannel(channelId!),
    enabled: !!channelId,
  });

  const { data: messagesData, fetchNextPage } = useInfiniteQuery({
    queryKey: ['messages', channelId],
    queryFn: ({ pageParam }) => {
      return api.getChannelMessages(channelId!, pageParam);
    },
    getNextPageParam: (_lastPage, pages) => {
      return pages.flatMap((page) => page.messages).length;
    },
    initialPageParam: 0,
    enabled: !!channelId,
  });

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
          ['messages', channelId],
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
    enabled: !!meData && !!channelId,
  });

  const scrollToBottom = () => {
    if (feedBoxRef.current && feedBoxRef.current.scrollTop >= -200) {
      feedBoxRef.current.scrollTop = 0;
    }
  };

  if (isLoading) {
    return <ProgressBar />;
  }

  if (!channelData || !messagesData) {
    return null;
  }

  return (
    <Box display="flex" position="fixed" top={0} left={0} bottom={0} right={0}>
      {isAboveMd && <ChannelLeftNav />}

      <Box display="flex" flexDirection="column" flex={1}>
        <ChannelTopNav channel={channelData.channel} />
        <MessageFeed
          feedBoxRef={feedBoxRef}
          onLoadMore={debounce(fetchNextPage, 500)}
          messages={messagesData.pages.flatMap((page) => page.messages)}
        />
        <MessageForm
          channelId={channelData.channel.id}
          onSend={scrollToBottom}
        />
      </Box>
    </Box>
  );
};
