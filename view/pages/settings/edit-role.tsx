import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../client/api-client';
import TopNav from '../../components/app/top-nav';
import ProgressBar from '../../components/shared/progress-bar';
import { NavigationPaths } from '../../constants/shared.constants';
import RoleForm from '../../components/roles/role-form';

const EditRole = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isPending, error } = useQuery({
    queryKey: ['role', id],
    queryFn: () => api.getRole(id!),
    enabled: !!id,
  });

  if (isPending) {
    return <ProgressBar />;
  }

  if (!data || error) {
    return <Typography>{t('errors.somethingWentWrong')}</Typography>;
  }

  return (
    <>
      <TopNav
        header={data.role.name}
        onBackClick={() => navigate(NavigationPaths.Roles)}
      />

      <RoleForm editRole={data.role} />
    </>
  );
};

export default EditRole;
