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
