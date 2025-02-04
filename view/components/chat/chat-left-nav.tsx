import { AddCircle, ExpandMore, Settings, Tag } from '@mui/icons-material';
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIconProps,
  SxProps,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { redirect, useNavigate } from 'react-router-dom';
import appIconImg from '../../assets/images/app-icon.png';
import { api } from '../../client/api-client';
import { NavigationPaths } from '../../constants/shared.constants';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { GRAY } from '../../styles/theme';
import LazyLoadImage from '../images/lazy-load-image';
import CreateChannelModal from './create-channel-modal';

/** Left panel navigation for desktop */
const ChatLeftNav = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  const { data: channelsData, isLoading: isChannalsLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: api.getChannels,
  });

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const navigate = useNavigate();

  const listItemBtnSx: SxProps = {
    borderRadius: '4px',
    marginRight: '6px',
    marginLeft: '8px',
    paddingRight: '10px',
    paddingLeft: '8px',
    height: '30px',
  };

  const menuButtonSx: SxProps = {
    cursor: 'pointer',
    userSelect: 'none',
    height: '55px',
    borderBottom: '1px solid',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50],
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '16px',
    paddingRight: '12px',
    borderRadius: 0,
    textTransform: 'none',
    width: '100%',
  };

  const menuItemIconProps: SvgIconProps = {
    sx: { marginRight: 1 },
    fontSize: 'small',
  };

  const handleMenuButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Box
      width="220px"
      bgcolor="background.paper"
      borderRight="1px solid"
      borderColor={isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}
    >
      <Button onClick={handleMenuButtonClick} sx={menuButtonSx}>
        <Box display="flex" gap="8px">
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

        <ExpandMore sx={{ fontSize: '22px' }} />
      </Button>

      <Menu
        anchorEl={menuAnchorEl}
        onClick={handleClose}
        onClose={handleClose}
        open={Boolean(menuAnchorEl)}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        transformOrigin={{
          horizontal: -18,
          vertical: -15,
        }}
        keepMounted
      >
        <MenuItem onClick={() => navigate(NavigationPaths.Settings)}>
          <Settings {...menuItemIconProps} />
          {t('navigation.serverSettings')}
        </MenuItem>

        <MenuItem onClick={() => setShowCreateChannelModal(true)}>
          <AddCircle {...menuItemIconProps} />
          {t('chat.actions.createChannel')}
        </MenuItem>
      </Menu>

      <CreateChannelModal
        isOpen={showCreateChannelModal}
        setIsOpen={setShowCreateChannelModal}
      />

      {!isChannalsLoading && channelsData && (
        <List>
          {channelsData.channels.map((channel) => (
            <ListItemButton
              key={channel.id}
              onClick={() => redirect(`/channels/${channel.id}`)}
              sx={listItemBtnSx}
            >
              <ListItemIcon sx={{ minWidth: '33px' }}>
                <Tag />
              </ListItemIcon>
              <ListItemText
                primary={channel.name}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: 600,
                    fontSize: '15px',
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ChatLeftNav;
