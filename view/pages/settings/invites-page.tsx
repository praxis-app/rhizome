import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import TopNav from '../../components/nav/top-nav';
import PermissionDenied from '../../components/roles/permission-denied';
import PrimaryButton from '../../components/shared/primary-button';
import ProgressBar from '../../components/shared/progress-bar';
import { NavigationPaths, Time } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';
import { Invite } from '../../types/invite.types';

const MAX_USES_OPTIONS = [1, 5, 10, 25, 50, 100];

interface FormValues {
  expiresAt: string;
  maxUses: string;
}

const InvitesPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const ability = useAbility();

  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: { expiresAt: '', maxUses: '' },
    mode: 'onChange',
  });

  const { mutate: createInvite, isPending: isCreatePending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const { invite } = await api.createInvite({
        expiresAt: Number(data.expiresAt) || undefined,
        maxUses: Number(data.maxUses) || undefined,
      });

      queryClient.setQueryData<{ invites: Invite[] }>(
        ['invites'],
        (oldData) => {
          if (!oldData) {
            return { invites: [] };
          }
          return { invites: [invite, ...oldData.invites] };
        },
      );
    },
    onSuccess: () => {
      reset();
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['invites'],
    queryFn: api.getInvites,
  });

  const expiresAtOptions = [
    {
      message: t('invites.form.expiresAtOptions.oneDay'),
      value: Time.Day,
    },
    {
      message: t('invites.form.expiresAtOptions.sevenDays'),
      value: Time.Week,
    },
    {
      message: t('invites.form.expiresAtOptions.oneMonth'),
      value: Time.Month,
    },
    {
      message: t('invites.form.expiresAtOptions.never'),
      value: '',
    },
  ];

  if (!ability.can('manage', 'Invite')) {
    return (
      <PermissionDenied
        topNavProps={{
          header: t('invites.headers.serverInvites'),
          onBackClick: () => navigate(NavigationPaths.Settings),
        }}
      />
    );
  }

  if (isLoading) {
    return <ProgressBar />;
  }

  return (
    <>
      <TopNav
        header={t('invites.headers.serverInvites')}
        onBackClick={() => navigate(NavigationPaths.Settings)}
      />

      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <form onSubmit={handleSubmit((fv) => createInvite(fv))}>
            <FormGroup sx={{ marginBottom: 1.5 }}>
              <FormControl variant="standard" sx={{ marginBottom: 1 }}>
                <InputLabel>{t('invites.form.labels.expiresAt')}</InputLabel>

                <Controller
                  control={control}
                  name="expiresAt"
                  render={({ field }) => (
                    <Select {...field}>
                      {expiresAtOptions.map((option) => (
                        <MenuItem value={option.value} key={option.value}>
                          {option.message}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl variant="standard">
                <InputLabel>{t('invites.form.labels.maxUses')}</InputLabel>

                <Controller
                  control={control}
                  name="maxUses"
                  render={({ field }) => (
                    <Select {...field}>
                      {MAX_USES_OPTIONS.map((option) => (
                        <MenuItem value={option} key={option}>
                          {t('invites.form.maxUsesOptions.xUses', {
                            count: option,
                          })}
                        </MenuItem>
                      ))}
                      <MenuItem value={''}>
                        {t('invites.form.maxUsesOptions.noLimit')}
                      </MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </FormGroup>

            <Box display="flex" justifyContent="end">
              <PrimaryButton
                sx={{ marginTop: 1.5 }}
                disabled={isCreatePending}
                type="submit"
              >
                {t('invites.actions.generateLink')}
              </PrimaryButton>
            </Box>
          </form>
        </CardContent>
      </Card>

      {JSON.stringify(data)}

      {error && <Typography>{t('errors.somethingWentWrong')}</Typography>}
    </>
  );
};

export default InvitesPage;
