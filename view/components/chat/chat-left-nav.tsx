import { Tag } from '@mui/icons-material';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { redirect } from 'react-router-dom';
import appIconImg from '../../assets/images/app-icon.png';
import { api } from '../../client/api-client';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { GRAY } from '../../styles/theme';
import LazyLoadImage from '../images/lazy-load-image';

/** Left panel navigation for desktop */
const ChatLeftNav = () => {
  const { data: channelsData, isLoading: isChannalsLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: api.getChannels,
  });

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();

  return (
    <Box
      width="220px"
      bgcolor="background.paper"
      borderRight="1px solid"
      borderColor={isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}
    >
      <Box
        height="55px"
        borderBottom="1px solid"
        borderColor={isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}
        display="flex"
        alignItems="center"
        paddingX="16px"
        gap="8px"
        sx={{
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <LazyLoadImage
          alt={t('labels.appIcon')}
          width="25px"
          height="auto"
          src={appIconImg}
          skipAnimation
        />
        <Typography fontWeight={700} fontSize="16px">
          {t('brand')}
        </Typography>
      </Box>

      {!isChannalsLoading && channelsData && (
        <List>
          {channelsData.channels.map((channel) => (
            <ListItemButton
              key={channel.id}
              onClick={() => redirect(`/channels/${channel.id}`)}
            >
              <ListItemIcon sx={{ minWidth: '33px' }}>
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
