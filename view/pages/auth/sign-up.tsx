import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormGroup,
  FormLabel,
  InputBaseComponentProps,
  OutlinedInput,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PrimaryActionButton from '../../components/shared/primary-button';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { Gray } from '../../styles/theme';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUp = () => {
  const { handleSubmit, register } = useForm<FormValues>({ mode: 'onChange' });

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();

  const inputProps: InputBaseComponentProps = {
    sx: {
      '&:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 100px ${isDarkMode ? Gray.PhantomShip : Gray.Placebo} inset`,
        WebkitTextFillColor: isDarkMode ? Gray.Placebo : Gray.PianoBlack,
      },
    },
  };

  const onSubmit = async (values: FormValues) => {
    console.log(values);
  };

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
