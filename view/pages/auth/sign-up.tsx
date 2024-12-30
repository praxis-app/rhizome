import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormGroup,
  FormLabel,
  InputBaseComponentProps,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { api } from '../../client/api-client';
import PrimaryActionButton from '../../components/shared/primary-button';
import ProgressBar from '../../components/shared/progress-bar';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { GRAY } from '../../styles/theme';
import { UserStatus } from '../../types/user.types';

interface FormValues {
  email: string;
  password: string;
}

export const SignUp = () => {
  const queryClient = useQueryClient();
  const { mutate: signUp, isLoading } = useMutation(api.completeRegistration, {
    onSuccess: () => queryClient.invalidateQueries('me'),
  });
  const { data: meData, isLoading: isMeLoading } = useMeQuery();

  const { handleSubmit, register } = useForm<FormValues>({
    mode: 'onChange',
  });

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();

  const inputProps: InputBaseComponentProps = {
    sx: {
      '&:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 100px ${isDarkMode ? GRAY['800'] : GRAY['100']} inset`,
        WebkitTextFillColor: isDarkMode ? GRAY['100'] : GRAY['950'],
      },
    },
  };

  if (isMeLoading || !meData) {
    return <ProgressBar />;
  }

  if (meData.user.status !== UserStatus.ANONYMOUS) {
    return <Typography>{t('users.prompts.alreadyRegistered')}</Typography>;
  }

  return (
    <Card>
      <CardHeader
        title={t('users.prompts.createAccount')}
        subheader={t('users.prompts.upgradeAccount')}
        sx={{ paddingBottom: 0 }}
      />
      <CardContent>
        <form onSubmit={handleSubmit((fv) => signUp(fv))}>
          <FormGroup sx={{ gap: 1.5, paddingBottom: 3 }}>
            <FormControl>
              <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                {t('users.form.email')}
              </FormLabel>
              <OutlinedInput
                autoComplete="off"
                inputProps={inputProps}
                {...register('email')}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                {t('users.form.password')}
              </FormLabel>
              <OutlinedInput
                autoComplete="off"
                inputProps={inputProps}
                type="password"
                {...register('password')}
              />
            </FormControl>
          </FormGroup>

          <PrimaryActionButton
            type="submit"
            sx={{ height: 45 }}
            disabled={isLoading}
            fullWidth
          >
            {t('users.actions.signUp')}
          </PrimaryActionButton>
        </form>
      </CardContent>
    </Card>
  );
};
