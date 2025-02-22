import { Box } from '@mui/material';
import { RefObject, UIEvent, useRef, useState } from 'react';
import { useInView, useScrollDirection } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
import { Message as MessageType } from '../../types/message.types';
import Message from './message';
import WelcomeMessage from '../invites/welcome-message';

interface Props {
  messages: MessageType[];
  feedBoxRef: RefObject<HTMLDivElement>;
  onLoadMore: () => void;
}

const MessageFeed = ({ messages, feedBoxRef, onLoadMore }: Props) => {
  const { inviteToken } = useAppStore((state) => state);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollDirection = useScrollDirection(feedBoxRef, 800);

  const feedTopRef = useRef<HTMLDivElement>(null);
  const { setViewed } = useInView(feedTopRef, '50px', () => {
    if (scrollPosition < -50 && scrollDirection === 'up') {
      setViewed(false);
      onLoadMore();
    }
  });

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollPosition(target.scrollTop);
  };

  return (
    <Box
      ref={feedBoxRef}
      display="flex"
      flexDirection="column-reverse"
      sx={{ overflowY: 'scroll' }}
      onScroll={handleScroll}
      paddingX={1.5}
      flex={1}
    >
      {!!inviteToken && <WelcomeMessage />}

      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {/* Bottom is top due to `column-reverse` */}
      <Box ref={feedTopRef} paddingBottom={2.25} />
    </Box>
  );
};

export default MessageFeed;
