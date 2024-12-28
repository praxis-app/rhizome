import {
  Card,
  CardContent,
  FormControl,
  FormGroup,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import PrimaryActionButton from '../../components/shared/primary-button';
import { useTranslation } from 'react-i18next';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUp = () => {
  const { handleSubmit, register } = useForm<FormValues>({ mode: 'onChange' });

  const { t } = useTranslation();

  const onSubmit = async (values: FormValues) => {
    console.log(values);
  };

  return (
    <Card sx={{ marginTop: 3 }}>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup sx={{ gap: 1.5, paddingBottom: 3 }}>
            <FormControl>
              <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                {t('users.form.username')}
              </FormLabel>
              <OutlinedInput autoComplete="off" {...register('name')} />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                {t('users.form.email')}
              </FormLabel>
              <OutlinedInput autoComplete="off" {...register('email')} />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                {t('users.form.password')}
              </FormLabel>
              <OutlinedInput
                autoComplete="off"
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
