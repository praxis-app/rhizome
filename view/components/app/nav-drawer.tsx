import { ExitToApp, PersonAdd, Settings } from '@mui/icons-material';
import {
  Box,
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
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import appIconImg from '../../assets/images/app-icon.png';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';
import ConfirmLogoutModal from '../auth/confirm-logout-modal';
import LazyLoadImage from '../images/lazy-load-image';
import UserAvatar from '../users/user-avatar';

const NavDrawer = () => {
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const { isNavDrawerOpen, setIsNavDrawerOpen, isLoggedIn } = useAppStore(
    (state) => state,
  );

  const { data } = useMeQuery();
  const ability = useAbility();

  const isAnon = !!data?.user.anonymous;
  const showSignUp = !isLoggedIn || isAnon;
  const showSettings = ability.can('manage', 'ServerConfig');

  const { t } = useTranslation();
  const navigate = useNavigate();

  const drawerSx: SxProps = {
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

  const handleNavigate = (path: string) => {
    setIsNavDrawerOpen(false);
    navigate(path);
  };

  const handleMenuButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Drawer
      anchor="left"
      open={isNavDrawerOpen}
      onClose={() => setIsNavDrawerOpen(false)}
      PaperProps={{ sx: { width: '100%', bgcolor: GRAY['900'] } }}
      sx={drawerSx}
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
        <Box display="flex" alignItems="center" gap="8px">
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
        </Box>

        {data && (
          <>
            <IconButton onClick={handleMenuButtonClick}>
              <UserAvatar
                userId={data.user.id}
                userName={data.user.name}
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
                  userId={data.user.id}
                  userName={data.user.name}
                  sx={{ fontSize: '10px' }}
                  size={20}
                />
                <Typography>{data.user.name}</Typography>
              </MenuItem>

              {showSettings && (
                <MenuItem
                  onClick={() => handleNavigate(NavigationPaths.Settings)}
                >
                  <Settings {...menuItemIconProps} />
                  {t('navigation.serverSettings')}
                </MenuItem>
              )}

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
        {/* TODO: List channels here when logged in */}

        {(showSignUp || !isLoggedIn) && (
          <List>
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
  );
};

export default NavDrawer;
