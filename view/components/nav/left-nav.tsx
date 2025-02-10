import {
  AddCircle,
  ExitToApp,
  ExpandMore,
  PersonAdd,
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
import { useAbility } from '../../hooks/role.hooks';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';
import { CurrentUser } from '../../types/user.types';
import ConfirmLogoutModal from '../auth/confirm-logout-modal';
import ChannelListItem from '../channels/channel-list-item';
import CreateChannelModal from '../channels/create-channel-modal';
import LazyLoadImage from '../images/lazy-load-image';
import UserAvatar from '../users/user-avatar';

interface Props {
  me?: CurrentUser;
}

/** Left panel navigation for desktop */
const LeftNav = ({ me }: Props) => {
  const { setToast } = useAppStore((state) => state);

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
  const ability = useAbility();

  const canManageSettings = ability.can('manage', 'ServerConfig');
  const canManageChannels = ability.can('manage', 'Channel');
  const isServerMenuBtnDisabled = !canManageSettings && !canManageChannels;

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
    width: '100%',
    '&:disabled': {
      color: 'text.primary',
    },
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
      <Button
        onClick={handleServerMenuBtnClick}
        disabled={isServerMenuBtnDisabled}
        sx={menuButtonSx}
      >
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

        {!isServerMenuBtnDisabled && <ExpandMore sx={{ fontSize: '22px' }} />}
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
        {ability.can('manage', 'ServerConfig') && (
          <MenuItem onClick={() => navigate(NavigationPaths.Settings)}>
            <Settings {...menuItemIconProps} />
            {t('navigation.serverSettings')}
          </MenuItem>
        )}

        {ability.can('manage', 'Channel') && (
          <MenuItem onClick={handleCreateChannelBtnClick}>
            <AddCircle {...menuItemIconProps} />
            {t('channels.actions.createChannel')}
          </MenuItem>
        )}
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

      <Box
        borderTop="1px solid"
        borderColor={isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}
        minHeight="58px"
        padding={0.8}
      >
        {me ? (
          <Box display="flex" justifyContent="space-between">
            <Button
              sx={{
                gap: '8px',
                minWidth: '115px',
                justifyContent: 'start',
                color: 'text.primary',
              }}
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

            <IconButton
              sx={{ height: '40px', alignSelf: 'center' }}
              onClick={() =>
                setToast({ title: t('prompts.inDev'), status: 'info' })
              }
            >
              <Settings sx={{ color: 'text.secondary' }} />
            </IconButton>

            <Menu
              anchorEl={userMenuEl}
              onClick={() => setUserMenuEl(null)}
              onClose={() => setUserMenuEl(null)}
              open={!!userMenuEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'center' }}
              transformOrigin={{
                horizontal: -22,
                vertical: me.anonymous ? 158 : 122.5,
              }}
              slotProps={{ paper: { sx: { minWidth: '185px' } } }}
              keepMounted
            >
              <MenuItem
                sx={{ gap: 1 }}
                onClick={() =>
                  setToast({
                    title: t('prompts.inDev'),
                    status: 'info',
                  })
                }
              >
                <UserAvatar
                  userId={me.id}
                  userName={me.name}
                  sx={{ fontSize: '10px' }}
                  size={20}
                />
                <Typography>{me.name}</Typography>
              </MenuItem>

              {me.anonymous && (
                <MenuItem>
                  <PersonAdd {...menuItemIconProps} />
                  {t('users.actions.signUp')}
                </MenuItem>
              )}

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
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="98%"
            gap="8px"
          >
            <Button
              sx={{ color: 'text.primary' }}
              onClick={() => navigate(NavigationPaths.Login)}
            >
              {t('users.actions.logIn')}
            </Button>
            <Button
              sx={{ color: 'text.primary' }}
              onClick={() => navigate(NavigationPaths.SignUp)}
            >
              {t('users.actions.signUp')}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LeftNav;
