import { Tag } from '@mui/icons-material';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'react-router-dom';
import { api } from '../../client/api-client';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { GRAY } from '../../styles/theme';

/** Left panel navigation for desktop */
const ChatLeftNav = () => {
  const { data: channelsData, isLoading: isChannalsLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: api.getChannels,
  });

  const isDarkMode = useIsDarkMode();

  return (
    <Box
      width="220px"
      bgcolor="background.paper"
      borderRight="1px solid"
      borderColor={isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}
    >
      {!isChannalsLoading && channelsData && (
        <List>
          {channelsData.channels.map((channel) => (
            <ListItemButton
              key={channel.id}
              onClick={() => redirect(`/channels/${channel.id}`)}
            >
              <ListItemIcon>
                <Tag />
              </ListItemIcon>
              <ListItemText primary={channel.name} />
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ChatLeftNav;
