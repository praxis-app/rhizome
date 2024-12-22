import { Box } from '@mui/material';
import { Message as MessageType } from '../../types/chat.types';
import Message from './message';
import { RefObject } from 'react';

interface Props {
  messages: MessageType[];
  feedBoxRef: RefObject<HTMLDivElement>;
}

const MessageFeed = ({ messages, feedBoxRef }: Props) => (
  <Box
    ref={feedBoxRef}
    display="flex"
    flexDirection="column-reverse"
    sx={{ overflowY: 'scroll' }}
    paddingTop={2}
    paddingX={1.5}
    flex={1}
  >
    {messages.map((message) => (
      <Message key={message.id} message={message} />
    ))}
  </Box>
);

export default MessageFeed;
