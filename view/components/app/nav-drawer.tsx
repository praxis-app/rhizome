import { Close, PersonAdd } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
} from '@mui/material';
import { useAppStore } from '../../store/app.store';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { NavigationPaths } from '../../constants/shared.constants';

const NavDrawer = () => {
  const { isNavDrawerOpen, setIsNavDrawerOpen, isLoggedIn } = useAppStore(
    (state) => state,
  );

  const { t } = useTranslation();
  const navigate = useNavigate();

  const drawerSx: SxProps = {
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(25px)',
    },
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
        )}
      </List>
    </Drawer>
  );
};

export default NavDrawer;
