import { Card, CardContent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import TopNav from '../../components/nav/top-nav';
import PermissionDenied from '../../components/roles/permission-denied';
import ConnectDiscordForm from '../../components/settings/connect-discord-form';
import ProgressBar from '../../components/shared/progress-bar';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';

const Integrations = () => {
  const { data: serverConfigData, isLoading } = useQuery({
    queryKey: ['serverConfig'],
    queryFn: () => api.getServerConfig(),
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const ability = useAbility();

  if (!ability.can('manage', 'ServerConfig')) {
    return (
      <PermissionDenied
        topNavProps={{
          header: t('roles.headers.serverRoles'),
          onBackClick: () => navigate(NavigationPaths.Settings),
        }}
      />
    );
  }

  if (isLoading) {
    return <ProgressBar />;
  }

  return (
    <>
      <TopNav
        header={t('settings.labels.integrations')}
        onBackClick={() => navigate(NavigationPaths.Settings)}
      />

      {serverConfigData && (
        <Card>
          <CardContent>
            <ConnectDiscordForm serverConfig={serverConfigData.serverConfig} />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Integrations;
