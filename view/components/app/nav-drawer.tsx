import {
  Chat,
  Close,
  ExitToApp,
  PersonAdd,
  Settings,
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
  SxProps,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import Modal from '../shared/modal';

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
      PaperProps={{ sx: { width: '100%' } }}
      sx={drawerSx}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        paddingLeft={1}
        height="55px"
      >
        <IconButton
          onClick={() => setIsNavDrawerOpen(false)}
          sx={{ width: 38, height: 38 }}
        >
          <Close />
        </IconButton>
      </Box>
      <Divider />

      <List sx={{ paddingTop: '16px' }}>
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
