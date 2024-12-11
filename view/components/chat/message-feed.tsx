import Message from './message';

interface Props {
  messages: any[];
}

const MessageFeed = ({ messages }: Props) => (
  <>
    {messages.map((message, index) => (
      <Message key={index} message={message} />
    ))}
  </>
);

export default MessageFeed;
