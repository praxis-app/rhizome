import { Box } from '@mui/material';
import { Message as MessageType } from '../../types/chat.types';
import Message from './message';

interface Props {
  messages: MessageType[];
}

const MessageFeed = ({ messages }: Props) => (
  <Box
    display="flex"
    flexDirection="column-reverse"
    sx={{ overflowY: 'scroll' }}
    paddingX={1.5}
  >
    {messages.map((message, index) => (
      <Message key={index} message={message} />
    ))}
  </Box>
);

export default MessageFeed;
