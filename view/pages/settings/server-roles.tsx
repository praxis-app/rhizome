import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/app/top-nav';
import RoleForm from '../../components/roles/role-form';

const ServerRoles = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <TopNav
        header={t('roles.headers.serverRoles')}
        onBackClick={() => navigate('/settings')}
      />

      <RoleForm />
    </>
  );
};

export default ServerRoles;
