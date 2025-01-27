import { Chat, ExitToApp, PersonAdd, Settings } from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import appIconImg from '../../assets/images/app-icon.png';
import { api } from '../../client/api-client';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';
import LazyLoadImage from '../images/lazy-load-image';
import Modal from '../shared/modal';
import UserAvatar from '../users/user-avatar';

const NavDrawer = () => {
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);

  const { isNavDrawerOpen, setIsNavDrawerOpen, isLoggedIn, setIsLoggedIn } =
    useAppStore((state) => state);

  const { data } = useMeQuery();
  const ability = useAbility();

  const isAnon = !!data?.user.anonymous;
  const showSignUp = !data?.user || isAnon;
  const showSettings = ability.can('manage', 'ServerConfig');

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logOut, isPending } = useMutation({
    mutationFn: api.logOut,
    onSuccess: async () => {
      await navigate(NavigationPaths.Home);
      setIsLogOutModalOpen(false);
      setIsNavDrawerOpen(false);
      setIsLoggedIn(false);
      queryClient.clear();
    },
  });

  const drawerSx: SxProps = {
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(25px)',
    },
  };

  const handleNavigate = (path: string) => {
    setIsNavDrawerOpen(false);
    navigate(path);
  };

  return (
    <Drawer
      anchor="left"
      open={isNavDrawerOpen}
      onClose={() => setIsNavDrawerOpen(false)}
      PaperProps={{ sx: { width: '100%', bgcolor: GRAY['950'] } }}
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
          <UserAvatar
            userId={data.user.id}
            userName={data.user.name}
            size={35}
            sx={{ fontSize: '16px' }}
          />
        )}
      </Box>

      <List
        sx={{
          paddingTop: '8px',
          backgroundColor: 'background.paper',
          borderTopRightRadius: '16px',
          borderTopLeftRadius: '16px',
          marginTop: '12px',
          height: '100%',
        }}
      >
        <ListItemButton onClick={() => handleNavigate(NavigationPaths.Home)}>
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary={t('navigation.chat')} />
        </ListItemButton>

        {showSettings && (
          <ListItemButton
            onClick={() => handleNavigate(NavigationPaths.Settings)}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={t('navigation.settings')} />
          </ListItemButton>
        )}

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
          <ListItemButton onClick={() => handleNavigate(NavigationPaths.Login)}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary={t('users.actions.logIn')} />
          </ListItemButton>
        )}

        {isLoggedIn && (
          <ListItemButton onClick={() => setIsLogOutModalOpen(true)}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary={t('users.actions.logOut')} />
          </ListItemButton>
        )}
      </List>

      <Modal
        open={isLogOutModalOpen}
        onClose={() => setIsLogOutModalOpen(false)}
      >
        <Typography marginBottom={3}>{t('users.prompts.logOut')}</Typography>
        <Box display="flex" gap={1}>
          <Button variant="contained">{t('actions.cancel')}</Button>
          <Button
            variant="contained"
            onClick={() => logOut()}
            disabled={isPending}
          >
            {t('users.actions.logOut')}
          </Button>
        </Box>
      </Modal>
    </Drawer>
  );
};

export default NavDrawer;
