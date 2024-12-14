import { Box } from '@mui/material';
import { Message as MessageType } from '../../types/chat.types';
import Message from './message';

interface Props {
  messages: MessageType[];
}

const MessageFeed = ({ messages }: Props) => (
  <Box paddingTop={2}>
    {messages.map((message, index) => (
      <Message key={index} message={message} />
    ))}
  </Box>
);

export default MessageFeed;
