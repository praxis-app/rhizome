import { Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/nav/top-nav';
import ConnectDiscordForm from '../../components/settings/connect-discord-form';
import { NavigationPaths } from '../../constants/shared.constants';

const Integrations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <TopNav
        header={t('settings.labels.integrations')}
        onBackClick={() => navigate(NavigationPaths.Settings)}
      />

      <Card>
        <CardContent>
          <ConnectDiscordForm />
        </CardContent>
      </Card>
    </>
  );
};

export default Integrations;
