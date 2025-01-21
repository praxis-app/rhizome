import { AdminPanelSettings, ChevronRight } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/app/top-nav';
import PermissionDenied from '../../components/roles/permission-denied';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';
import { useIsDarkMode } from '../../hooks/shared.hooks';

const ServerSettings = () => {
  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const navigate = useNavigate();
  const ability = useAbility();

  if (!ability.can('manage', 'ServerConfig')) {
    return (
      <PermissionDenied
        topNavProps={{
          header: t('navigation.serverSettings'),
          onBackClick: () => navigate(NavigationPaths.Home),
        }}
      />
    );
  }

  return (
    <>
      <TopNav header={t('navigation.serverSettings')} />

      <Box
        onClick={() => navigate(NavigationPaths.Roles)}
        sx={{
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: isDarkMode
            ? 'none'
            : '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1);',
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
