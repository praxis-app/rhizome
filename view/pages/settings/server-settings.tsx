import { AdminPanelSettings, ChevronRight, Close } from '@mui/icons-material';
import { Box, Button, SxProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/nav/top-nav';
import PermissionDenied from '../../components/roles/permission-denied';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';
import { useAboveBreakpoint, useIsDarkMode } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';

const ServerSettings = () => {
  const { setIsNavDrawerOpen } = useAppStore((state) => state);

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const isAboveMd = useAboveBreakpoint('md');
  const navigate = useNavigate();
  const ability = useAbility();

  const canManageSettings = ability.can('manage', 'ServerConfig');
  const canManageRoles = ability.can('manage', 'Role') && canManageSettings;

  const buttonIconSx: SxProps = {
    color: canManageRoles ? 'text.secondary' : 'text.disabled',
  };

  const rolesBtnSx: SxProps = {
    boxShadow: isDarkMode
      ? 'none'
      : '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1);',
    backgroundColor: isDarkMode
      ? 'rgba(255, 255, 255, 0.045)'
      : 'background.paper',
    border: isDarkMode ? 'none' : `1px solid ${GRAY[100]}`,
    color: 'text.primary',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    userSelect: 'none',
  };

  if (!canManageSettings) {
    return (
      <PermissionDenied
        topNavProps={{
          header: t('navigation.serverSettings'),
          onBackClick: () => navigate(NavigationPaths.Home),
        }}
      />
    );
  }

  const handleBackClick = () => {
    if (isAboveMd) {
      navigate(NavigationPaths.Home);
      return;
    }
    setIsNavDrawerOpen(true);
  };

  return (
    <>
      <TopNav
        header={t('navigation.serverSettings')}
        onBackClick={handleBackClick}
        backBtnIcon={<Close />}
      />

      {/* TODO: Add shared component for this button type */}
      <Button
        sx={rolesBtnSx}
        onClick={() => navigate(NavigationPaths.Roles)}
        disabled={!canManageRoles}
      >
        <Box display="flex" gap={1.5}>
          <AdminPanelSettings sx={buttonIconSx} />
          {t('navigation.roles')}
        </Box>
        <ChevronRight sx={buttonIconSx} />
      </Button>
    </>
  );
};

export default ServerSettings;
