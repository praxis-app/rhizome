import { useQuery } from '@tanstack/react-query';
import { api } from '../../client/api-client';
import { List } from '@mui/material';
import ChannelListItem from './channel-list-item';
import { useParams } from 'react-router-dom';

const ChannelList = () => {
  const { data: channelsData } = useQuery({
    queryKey: ['channels'],
    queryFn: api.getChannels,
  });

  const { channelId } = useParams();

  if (!channelsData) {
    return null;
  }

  return (
    <List sx={{ flex: 1, overflowY: 'scroll' }}>
      {channelsData.channels.map((channel) => (
        <ChannelListItem
          key={channel.id}
          channel={channel}
          isActive={channelId === channel.id}
        />
      ))}
    </List>
  );
};

export default ChannelList;
