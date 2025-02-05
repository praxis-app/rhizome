import {
  AddCircle,
  ChevronRight,
  ExitToApp,
  PersonAdd,
  Settings,
  Tag,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
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
import { useNavigate } from 'react-router-dom';
import appIconImg from '../../assets/images/app-icon.png';
import { api } from '../../client/api-client';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';
import ConfirmLogoutModal from '../auth/confirm-logout-modal';
import CreateChannelModal from '../chat/create-channel-modal';
import LazyLoadImage from '../images/lazy-load-image';
import UserAvatar from '../users/user-avatar';

const NavDrawer = () => {
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [isBottomDrawerOpen, setIsBottomDrawerOpen] = useState(false);

  const { isNavDrawerOpen, setIsNavDrawerOpen, isLoggedIn } = useAppStore(
    (state) => state,
  );

  const { t } = useTranslation();
  const navigate = useNavigate();
  const ability = useAbility();
  const isAboveMd = useAboveBreakpoint('md');

  const { data: channelsData, isLoading: isChannalsLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: api.getChannels,
    enabled: !isAboveMd,
  });

  const { data: meData } = useMeQuery({
    enabled: !isAboveMd,
  });

  const me = meData?.user;
  const isAnon = !!me?.anonymous;
  const showSignUp = !isLoggedIn || isAnon;
  const showSettings = ability.can('manage', 'ServerConfig');

  const leftDrawerSx: SxProps = {
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(25px)',
    },
  };

  const menuItemIconProps: SvgIconProps = {
    fontSize: 'small',
    sx: {
      marginRight: 1,
    },
  };

  const bottomDrawerProps = {
    sx: {
      height: 'calc(100% - 68px)',
      bgcolor: GRAY['900'],
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      paddingTop: '12px',
      paddingX: '16px',
    },
  };

  const handleNavigate = async (path: string) => {
    setIsBottomDrawerOpen(false);
    setIsNavDrawerOpen(false);
    navigate(path);
  };

  const handleMenuButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  if (isAboveMd) {
    return null;
  }

  return (
    <>
      <Drawer
        anchor="left"
        open={isNavDrawerOpen}
        onClose={() => {
          setIsBottomDrawerOpen(false);
          setIsNavDrawerOpen(false);
        }}
        PaperProps={{ sx: { width: '100%', bgcolor: GRAY['900'] } }}
        sx={leftDrawerSx}
      >
        <Box
          display="flex"
          alignItems="center"
          paddingLeft={1}
          height="55px"
          justifyContent="space-between"
          paddingX="16px"
          paddingTop="12px"
        >
          <Button
            sx={{
              gap: '8px',
              alignItems: 'center',
              textTransform: 'none',
              borderRadius: '8px',
            }}
            onClick={() => setIsBottomDrawerOpen(true)}
          >
            <LazyLoadImage
              alt="App icon"
              width="35px"
              height="auto"
              src={appIconImg}
              sx={{ cursor: 'pointer' }}
              skipAnimation
            />
            <Typography fontWeight={700} fontSize="18px">
              {t('brand')}
            </Typography>
            <ChevronRight
              sx={{ color: 'text.secondary', marginTop: '2px' }}
              fontSize="small"
            />
          </Button>

          {me && (
            <>
              <IconButton onClick={handleMenuButtonClick}>
                <UserAvatar
                  userId={me.id}
                  userName={me.name}
                  sx={{ fontSize: '16px' }}
                  size={35}
                />
              </IconButton>

              <Menu
                anchorEl={menuAnchorEl}
                onClick={handleClose}
                onClose={handleClose}
                open={Boolean(menuAnchorEl)}
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'bottom',
                }}
                transformOrigin={{
                  horizontal: 'right',
                  vertical: -4,
                }}
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
            </>
          )}
        </Box>

        <Box
          paddingTop="8px"
          bgcolor={GRAY['800']}
          sx={{ borderTopRightRadius: '16px', borderTopLeftRadius: '16px' }}
          marginTop="12px"
          height="100%"
        >
          {!isChannalsLoading && channelsData && (
            <List>
              {channelsData.channels.map((channel) => (
                <ListItemButton
                  key={channel.id}
                  onClick={() => handleNavigate(`/channels/${channel.id}`)}
                >
                  <ListItemIcon sx={{ minWidth: '33px' }}>
                    <Tag />
                  </ListItemIcon>
                  <ListItemText primary={channel.name} />
                </ListItemButton>
              ))}
            </List>
          )}

          {(showSignUp || !isLoggedIn) && (
            <List>
              <Divider sx={{ marginX: '16px' }} />

              {/* TODO: Show link to general channel here */}

              {showSignUp && (
                <ListItemButton
                  onClick={() => handleNavigate(NavigationPaths.SignUp)}
                >
                  <ListItemIcon>
                    <PersonAdd />
                  </ListItemIcon>
                  <ListItemText primary={t('users.actions.signUp')} />
                </ListItemButton>
              )}

              {!isLoggedIn && (
                <ListItemButton
                  onClick={() => handleNavigate(NavigationPaths.Login)}
                >
                  <ListItemIcon>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText primary={t('users.actions.logIn')} />
                </ListItemButton>
              )}
            </List>
          )}
        </Box>

        <ConfirmLogoutModal
          isOpen={isLogOutModalOpen}
          setIsOpen={setIsLogOutModalOpen}
        />
      </Drawer>

      <Drawer
        anchor="bottom"
        open={isBottomDrawerOpen}
        onClose={() => setIsBottomDrawerOpen(false)}
        PaperProps={bottomDrawerProps}
      >
        <List>
          <ListItemButton onClick={() => setShowCreateChannelModal(true)}>
            <ListItemIcon>
              <AddCircle />
            </ListItemIcon>
            <ListItemText primary={t('chat.actions.createChannel')} />
          </ListItemButton>

          {showSettings && (
            <ListItemButton
              onClick={() => handleNavigate(NavigationPaths.Settings)}
            >
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary={t('navigation.serverSettings')} />
            </ListItemButton>
          )}
        </List>

        <CreateChannelModal
          isOpen={showCreateChannelModal}
          setIsOpen={setShowCreateChannelModal}
          onSubmit={() => {
            setIsBottomDrawerOpen(false);
            setIsNavDrawerOpen(false);
          }}
        />
      </Drawer>
    </>
  );
};

export default NavDrawer;
