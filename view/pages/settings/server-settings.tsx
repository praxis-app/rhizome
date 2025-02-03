import { AdminPanelSettings, ChevronRight, Close } from '@mui/icons-material';
import { Box } from '@mui/material';
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

  // TODO: Update to check for ServerConfig after adding more settings
  if (!ability.can('manage', 'Role')) {
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

      <Box
        onClick={() => navigate(NavigationPaths.Roles)}
        sx={{
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: isDarkMode
            ? 'none'
            : '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1);',
          border: isDarkMode ? 'none' : `1px solid ${GRAY[100]}`,
        }}
        display="flex"
        justifyContent="space-between"
        bgcolor="background.paper"
        borderRadius="8px"
        padding="14px"
        width="100%"
      >
        <Box display="flex" gap={1.5}>
          <AdminPanelSettings />
          {t('navigation.roles')}
        </Box>
        <ChevronRight />
      </Box>
    </>
  );
};

export default ServerSettings;
