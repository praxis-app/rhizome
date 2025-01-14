import { useTranslation } from 'react-i18next';
import TopNav from '../../components/app/top-nav';
import { useNavigate } from 'react-router-dom';

const ServerRoles = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <TopNav
        header={t('navigation.serverSettings')}
        onBackClick={() => navigate('/settings')}
      />
    </>
  );
};

export default ServerRoles;
