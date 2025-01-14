import { useTranslation } from 'react-i18next';
import TopNav from '../../components/app/top-nav';

const RolesPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <TopNav header={t('navigation.serverSettings')} />
    </>
  );
};

export default RolesPage;
