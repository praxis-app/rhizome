import { Box } from '@mui/material';
import Message from './message';

interface Props {
  messages: any[];
}

const MessageFeed = ({ messages }: Props) => (
  <Box paddingTop={2}>
    {messages.map((message, index) => (
      <Message key={index} message={message} />
    ))}
  </Box>
);

export default MessageFeed;
