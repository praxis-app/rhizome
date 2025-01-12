import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/app.store';

const RolesPage = () => {
  const { setNavHeader } = useAppStore((state) => state);

  const { t } = useTranslation();

  useEffect(() => {
    setNavHeader(t('roles.labels.serverRoles'));

    return () => {
      setNavHeader(null);
    };
  }, [setNavHeader, t]);

  return <></>;
};

export default RolesPage;
