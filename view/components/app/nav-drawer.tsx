import { Close, ExitToApp, PersonAdd } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAppStore } from '../../store/app.store';
import Modal from '../shared/modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../client/api-client';

const NavDrawer = () => {
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);

  const { isNavDrawerOpen, setIsNavDrawerOpen, isLoggedIn, setIsLoggedIn } =
    useAppStore((state) => state);

  const queryClient = useQueryClient();

  const { mutate: logOut, isPending } = useMutation({
    mutationFn: async () => {
      await api.logOut();
      setIsLogOutModalOpen(false);
      setIsNavDrawerOpen(false);
      setIsLoggedIn(false);
      queryClient.clear();
    },
  });

  const { t } = useTranslation();
  const navigate = useNavigate();

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

      <List>
        {!isLoggedIn && (
          <>
            <ListItemButton
              onClick={() => {
                navigate(NavigationPaths.SignUp);
                setIsNavDrawerOpen(false);
              }}
            >
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary={t('users.actions.signUp')} />
            </ListItemButton>

            <ListItemButton
              onClick={() => handleNavigate(NavigationPaths.Login)}
            >
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary={t('users.actions.logIn')} />
            </ListItemButton>
          </>
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
            startIcon={
              isPending && (
                <CircularProgress
                  size={13}
                  color="inherit"
                  sx={{ marginRight: 0.75 }}
                />
              )
            }
          >
            {t('users.actions.logOut')}
          </Button>
        </Box>
      </Modal>
    </Drawer>
  );
};

export default NavDrawer;
