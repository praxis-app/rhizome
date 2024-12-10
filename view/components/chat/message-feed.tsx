import { Box } from '@mui/material';

interface Props {
  messages: any[];
}

const MessageFeed = ({ messages }: Props) => {
  return (
    <Box color="white" height="10px">
      {JSON.stringify(messages)}
    </Box>
  );
};

export default MessageFeed;
