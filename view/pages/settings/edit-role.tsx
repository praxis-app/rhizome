import { Card, Tab, Tabs, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../client/api-client';
import TopNav from '../../components/app/top-nav';
import RoleForm from '../../components/roles/role-form';
import ProgressBar from '../../components/shared/progress-bar';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';

export enum EditRoleTabName {
  Permissions = 'permissions',
  Members = 'members',
}

const EditRole = () => {
  const [tab, setTab] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const isAboveSmall = useAboveBreakpoint('sm');
  const { roleId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isPending, error } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => api.getRole(roleId!),
    enabled: !!roleId,
  });

  const tabParam = searchParams.get('tab');

  useEffect(() => {
    if (tabParam === EditRoleTabName.Permissions) {
      setTab(1);
      return;
    }
    if (tabParam === EditRoleTabName.Members) {
      setTab(2);
      return;
    }
    setTab(0);
  }, [tabParam, setTab]);

  const handleTabChange = (
    _: SyntheticEvent<Element, Event>,
    value: number,
  ) => {
    if (value === 1) {
      setSearchParams({ tab: EditRoleTabName.Permissions });
      return;
    }
    if (value === 2) {
      setSearchParams({ tab: EditRoleTabName.Members });
      return;
    }
    setSearchParams({});
  };

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

      <Card sx={{ marginBottom: 6 }}>
        <Tabs
          onChange={handleTabChange}
          value={tab}
          variant={isAboveSmall ? 'standard' : 'fullWidth'}
          centered
        >
          <Tab label={t('roles.tabs.display')} />
          <Tab label={t('roles.tabs.permissions')} />
          <Tab label={t('roles.tabs.members')} />
        </Tabs>
      </Card>

      {tab === 0 && <RoleForm editRole={data.role} />}
    </>
  );
};

export default EditRole;
