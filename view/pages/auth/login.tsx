import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Card,
  CardContent,
  FormControl,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  SxProps,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/shared/primary-button';
import ProgressBar from '../../components/shared/progress-bar';
import { NavigationPaths } from '../../constants/shared.constants';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';
import { UserStatus } from '../../types/user.types';

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const { isLoggedIn } = useAppStore((state) => state);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data: meData, isLoading: isMeLoading } = useMeQuery({
    enabled: isLoggedIn,
    retry: false,
  });

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (meData && meData.user.status !== UserStatus.ANONYMOUS) {
      navigate(NavigationPaths.Home);
      setIsRedirecting(true);
    }
  }, [meData, navigate, setIsRedirecting]);

  const { register, formState } = useForm<FormValues>({
    mode: 'onChange',
  });

  const registerEmailProps = register('email');
  const registerPasswordProps = register('password');

  const showPasswordIconSx: SxProps = {
    color: isDarkMode ? GRAY['300'] : GRAY['900'],
  };
  const inputBaseSx: SxProps = {
    '&:-webkit-autofill': {
      WebkitBoxShadow: `0 0 0 100px ${isDarkMode ? GRAY['800'] : GRAY['100']} inset`,
      WebkitTextFillColor: isDarkMode ? GRAY['100'] : GRAY['950'],
    },
  };

  const renderShowPassword = () => (
    <InputAdornment position="end" sx={{ marginRight: 0.5 }}>
      <IconButton
        onClick={() => setShowPassword(!showPassword)}
        onMouseDown={(e) => e.preventDefault()}
        onMouseUp={(e) => e.preventDefault()}
        edge="end"
      >
        {showPassword ? (
          <VisibilityOff sx={showPasswordIconSx} />
        ) : (
          <Visibility sx={showPasswordIconSx} />
        )}
      </IconButton>
    </InputAdornment>
  );

  const isSignedUp = meData && meData.user.status !== UserStatus.ANONYMOUS;
  if (isMeLoading || isRedirecting || isSignedUp) {
    return <ProgressBar />;
  }

  return (
    <Card>
      <CardContent>
        <form>
          <FormGroup sx={{ gap: 1.5, paddingBottom: 3 }}>
            <FormControl>
              <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                {t('users.form.email')}
              </FormLabel>
              <OutlinedInput
                autoComplete="off"
                inputProps={{ sx: inputBaseSx }}
                {...registerEmailProps}
              />
              {!!formState.errors.email && (
                <Typography color="error" fontSize="small" paddingTop={0.5}>
                  {formState.errors.email.message}
                </Typography>
              )}
            </FormControl>

            <FormControl>
              <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                {t('users.form.password')}
              </FormLabel>
              <OutlinedInput
                autoComplete="off"
                type={showPassword ? 'text' : 'password'}
                endAdornment={renderShowPassword()}
                inputProps={{
                  sx: {
                    borderTopRightRadius: '0 !important',
                    borderBottomRightRadius: '0 !important',
                    ...inputBaseSx,
                  },
                }}
                {...registerPasswordProps}
              />
              {!!formState.errors.password && (
                <Typography color="error" fontSize="small" paddingTop={0.5}>
                  {formState.errors.password.message}
                </Typography>
              )}
            </FormControl>
          </FormGroup>

          <PrimaryButton type="submit" sx={{ height: 45 }} fullWidth>
            {t('users.actions.logIn')}
          </PrimaryButton>
        </form>
      </CardContent>
    </Card>
  );
};

export default Login;
