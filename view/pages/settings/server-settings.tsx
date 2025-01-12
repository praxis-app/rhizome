import { AdminPanelSettings, ChevronRight } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/app.store';
import { NavigationPaths } from '../../constants/shared.constants';

const ServerSettings = () => {
  const { setNavHeader } = useAppStore((state) => state);

  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setNavHeader(t('navigation.serverSettings'));
    return () => {
      setNavHeader(null);
    };
  }, [setNavHeader, t]);

  return (
    <>
      <Box
        onClick={() => navigate(NavigationPaths.Roles)}
        sx={{ cursor: 'pointer', userSelect: 'none' }}
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
