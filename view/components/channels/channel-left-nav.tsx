import {
  AddCircle,
  ExitToApp,
  ExpandMore,
  Settings,
} from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  List,
  Menu,
  MenuItem,
  SvgIconProps,
  SxProps,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import appIconImg from '../../assets/images/app-icon.png';
import { api } from '../../client/api-client';
import { NavigationPaths } from '../../constants/shared.constants';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { GRAY } from '../../styles/theme';
import { CurrentUser } from '../../types/user.types';
import ConfirmLogoutModal from '../auth/confirm-logout-modal';
import LazyLoadImage from '../images/lazy-load-image';
import UserAvatar from '../users/user-avatar';
import ChannelListItem from './channel-list-item';
import CreateChannelModal from './create-channel-modal';

interface Props {
  me?: CurrentUser;
}

/** Left panel navigation for desktop */
const ChannelLeftNav = ({ me }: Props) => {
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [serverMenuEl, setServerMenuEl] = useState<HTMLElement | null>(null);
  const [userMenuEl, setUserMenuEl] = useState<HTMLElement | null>(null);
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);

  const { data: channelsData, isLoading: isChannalsLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: api.getChannels,
  });

  const { t } = useTranslation();
  const { channelId } = useParams();
  const isDarkMode = useIsDarkMode();
  const navigate = useNavigate();

  const menuButtonSx: SxProps = {
    cursor: 'pointer',
    userSelect: 'none',
    height: '55px',
    borderBottom: '1px solid',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50],
    color: 'text.primary',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '16px',
    paddingRight: '12px',
    borderRadius: 0,
    textTransform: 'none',
    width: '100%',
  };
  const onlineBadge: SxProps = {
    bgcolor: '#50a361',
    border: '2.5px solid',
    borderColor: 'background.paper',
    borderRadius: 9999,
    height: 15,
    width: 15,
    position: 'absolute',
    top: 20,
    right: -5,
  };
  const menuItemIconProps: SvgIconProps = {
    sx: { marginRight: 1 },
    fontSize: 'small',
  };

  const handleServerMenuBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    setServerMenuEl(event.currentTarget);
  };

  const handleUserMenuBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    setUserMenuEl(event.currentTarget);
  };

  const handleCreateChannelBtnClick = () => {
    setShowCreateChannelModal(true);
    setServerMenuEl(null);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="240px"
      bgcolor="background.paper"
      borderRight="1px solid"
      borderColor={isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}
    >
      <Button onClick={handleServerMenuBtnClick} sx={menuButtonSx}>
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
        anchorEl={serverMenuEl}
        onClick={() => setServerMenuEl(null)}
        onClose={() => setServerMenuEl(null)}
        open={!!serverMenuEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: -18, vertical: -15 }}
        keepMounted
      >
        <MenuItem onClick={() => navigate(NavigationPaths.Settings)}>
          <Settings {...menuItemIconProps} />
          {t('navigation.serverSettings')}
        </MenuItem>

        <MenuItem onClick={handleCreateChannelBtnClick}>
          <AddCircle {...menuItemIconProps} />
          {t('channels.actions.createChannel')}
        </MenuItem>
      </Menu>

      <CreateChannelModal
        isOpen={showCreateChannelModal}
        setIsOpen={setShowCreateChannelModal}
      />

      {!isChannalsLoading && channelsData && (
        <List sx={{ flex: 1, overflowY: 'scroll' }}>
          {channelsData.channels.map((channel) => (
            <ChannelListItem
              key={channel.id}
              channel={channel}
              isActive={channelId === channel.id}
            />
          ))}
        </List>
      )}

      {me && (
        <Box
          display="flex"
          justifyContent="space-between"
          borderTop="1px solid"
          borderColor={isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}
          padding={0.8}
        >
          <Button
            sx={{ textTransform: 'none', gap: '8px' }}
            onClick={handleUserMenuBtnClick}
          >
            <Box position="relative">
              <UserAvatar
                userId={me.id}
                userName={me.name}
                sx={{ fontSize: '14px', alignSelf: 'center' }}
                size={30}
              />
              <Box sx={onlineBadge} />
            </Box>
            <Box textAlign="left" alignSelf="center">
              <Box lineHeight={1.25} fontSize="14px">
                {me.name}
              </Box>
              <Box color="text.secondary" lineHeight={1.25} fontSize="12px">
                {t('users.labels.online')}
              </Box>
            </Box>
          </Button>

          <IconButton sx={{ height: '40px', alignSelf: 'center' }}>
            <Settings sx={{ color: 'text.secondary' }} />
          </IconButton>

          <Menu
            anchorEl={userMenuEl}
            onClick={() => setUserMenuEl(null)}
            onClose={() => setUserMenuEl(null)}
            open={!!userMenuEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            transformOrigin={{ horizontal: -22, vertical: 100 }}
            keepMounted
          >
            <MenuItem sx={{ gap: 1 }}>
              <UserAvatar
                userId={me.id}
                userName={me.name}
                sx={{ fontSize: '10px' }}
                size={20}
              />
              <Typography>{me.name}</Typography>
            </MenuItem>

            <MenuItem onClick={() => setIsLogOutModalOpen(true)}>
              <ExitToApp {...menuItemIconProps} />
              {t('users.actions.logOut')}
            </MenuItem>
          </Menu>

          <ConfirmLogoutModal
            isOpen={isLogOutModalOpen}
            setIsOpen={setIsLogOutModalOpen}
          />
        </Box>
      )}
    </Box>
  );
};

export default ChannelLeftNav;
