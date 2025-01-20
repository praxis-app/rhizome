import { AddCircle, ArrowForwardIos } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardContent as MuiCardContent,
  styled,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../client/api-client';
import TopNav from '../../components/app/top-nav';
import AddRoleMemberOption from '../../components/roles/add-role-member-option';
import PermissionsForm from '../../components/roles/permissions-form';
import RoleForm from '../../components/roles/role-form';
import Modal from '../../components/shared/modal';
import ProgressBar from '../../components/shared/progress-bar';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';

const FlexCardContent = styled(MuiCardContent)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: 12,
  paddingTop: 13,
}));

export enum EditRoleTabName {
  Permissions = 'permissions',
  Members = 'members',
}

const EditRolePage = () => {
  const [tab, setTab] = useState(0);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const isAboveSmall = useAboveBreakpoint('sm');
  const { roleId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    data: roleData,
    isPending: isRolePending,
    error: roleError,
  } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => api.getRole(roleId!),
    enabled: !!roleId,
  });

  const {
    data: eligibleUsersData,
    isPending: isEligibleUsersPending,
    error: eligibleUsersError,
  } = useQuery({
    queryKey: ['role', roleId, 'members', 'eligible'],
    queryFn: () => api.getUsersEligibleForRole(roleId!),
    enabled: !!roleId && tab === 2,
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

  if (isRolePending || isEligibleUsersPending) {
    return <ProgressBar />;
  }

  if (!roleData || roleError || eligibleUsersError) {
    return <Typography>{t('errors.somethingWentWrong')}</Typography>;
  }

  return (
    <>
      <TopNav
        header={roleData.role.name}
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

      {tab === 0 && <RoleForm editRole={roleData.role} />}

      {tab === 1 && <PermissionsForm role={roleData.role} />}

      {tab === 2 && (
        <>
          <Card sx={{ cursor: 'pointer' }}>
            <CardActionArea onClick={() => setIsModalOpen(true)}>
              <FlexCardContent>
                <Box display="flex">
                  <AddCircle
                    sx={{
                      fontSize: 23,
                      marginRight: 1.25,
                    }}
                  />
                  <Typography color="primary">
                    {t('roles.actions.addMembers')}
                  </Typography>
                </Box>
                <ArrowForwardIos
                  fontSize="small"
                  sx={{ transform: 'translateY(2px)' }}
                />
              </FlexCardContent>
            </CardActionArea>
          </Card>

          <Modal
            title={t('roles.actions.addMembers')}
            actionLabel={t('roles.actions.add')}
            closingAction={() => setIsModalOpen(false)}
            onClose={() => setIsModalOpen(false)}
            open={isModalOpen}
          >
            {eligibleUsersData?.users.map((user) => (
              <AddRoleMemberOption
                key={user.id}
                selectedUserIds={selectedUserIds}
                setSelectedUserIds={setSelectedUserIds}
                user={user}
              />
            ))}
          </Modal>
        </>
      )}
    </>
  );
};

export default EditRolePage;
