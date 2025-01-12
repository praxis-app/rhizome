import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/app.store';

const ServerSettings = () => {
  const { setNavHeader } = useAppStore((state) => state);
  const { t } = useTranslation();

  useEffect(() => {
    setNavHeader(t('navigation.serverSettings'));

    return () => {
      setNavHeader(null);
    };
  }, [setNavHeader, t]);

  return <></>;
};

export default ServerSettings;
