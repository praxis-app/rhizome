import { Card, CardContent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import TopNav from '../../components/nav/top-nav';
import ConnectDiscordForm from '../../components/settings/connect-discord-form';
import { NavigationPaths } from '../../constants/shared.constants';

const Integrations = () => {
  const { data: serverConfigData } = useQuery({
    queryKey: ['serverConfig'],
    queryFn: () => api.getServerConfig(),
  });

  const { t } = useTranslation();
  const navigate = useNavigate();

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
