import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputBaseComponentProps,
  OutlinedInput,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PrimaryActionButton from '../../components/shared/primary-button';
import ProgressBar from '../../components/shared/progress-bar';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { GRAY } from '../../styles/theme';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUp = () => {
  const { handleSubmit, register, setValue } = useForm<FormValues>({
    mode: 'onChange',
  });

  const { isLoading } = useMeQuery({
    onSuccess(data) {
      setValue('name', data.user.name);
    },
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

  const onSubmit = async (values: FormValues) => {
    console.log(values);
  };

  if (isLoading) {
    return <ProgressBar />;
  }

  return (
    <Card>
      <CardHeader
        title={t('users.prompts.createAccount')}
        subheader={t('users.prompts.upgradeAccount')}
        sx={{ paddingBottom: 0 }}
      />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup sx={{ gap: 1.5, paddingBottom: 3 }}>
            <FormControl>
              <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                {t('users.form.username')}
              </FormLabel>
              <OutlinedInput
                autoComplete="off"
                inputProps={inputProps}
                {...register('name')}
              />
              <FormHelperText sx={{ marginLeft: 0.1 }}>
                {t('users.prompts.usernameHelper')}
              </FormHelperText>
            </FormControl>

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

            <FormControl>
              <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                {t('users.form.confirmPassword')}
              </FormLabel>
              <OutlinedInput
                autoComplete="off"
                inputProps={inputProps}
                type="password"
                {...register('confirmPassword')}
              />
            </FormControl>
          </FormGroup>

          <PrimaryActionButton type="submit" sx={{ height: 45 }} fullWidth>
            {t('users.actions.signUp')}
          </PrimaryActionButton>
        </form>
      </CardContent>
    </Card>
  );
};
