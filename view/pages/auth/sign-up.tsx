import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  SxProps,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import TopNav from '../../components/app/top-nav';
import PrimaryButton from '../../components/shared/primary-button';
import ProgressBar from '../../components/shared/progress-bar';
import {
  LocalStorageKeys,
  NavigationPaths,
} from '../../constants/shared.constants';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const EMAIL_MAX_LENGTH = 254;

const NAME_REGEX = /^[A-Za-z0-9 ]+$/;
const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 15;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

interface FormValues {
  email: string;
  name: string;
  password: string;
}

const SignUp = () => {
  const { setToast, isLoggedIn, setIsLoggedIn } = useAppStore((state) => state);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: signUp, isPending: isSignUpPending } = useMutation({
    mutationFn: api.signUp,
    onSuccess: ({ access_token }) => {
      localStorage.setItem(LocalStorageKeys.AccessToken, access_token);
      navigate(NavigationPaths.Home);
      setIsRedirecting(true);
      setIsLoggedIn(true);
    },
    onError: (error: Error) => {
      setToast({
        title: error.message,
        status: 'error',
      });
    },
  });

  const { mutate: upgradeAnon, isPending: isUpgradeAnonPending } = useMutation({
    mutationFn: api.upgradeAnonSession,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['me'] });
      navigate(NavigationPaths.Home);
      setIsRedirecting(true);
    },
    onError: (error: Error) => {
      setToast({
        title: error.message,
        status: 'error',
      });
    },
  });

  const { data: meData, isLoading: isMeLoading } = useMeQuery({
    enabled: isLoggedIn,
    retry: false,
  });

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (meData && !meData.user.anonymous) {
      navigate(NavigationPaths.Home);
      setIsRedirecting(true);
    }
  }, [meData, navigate, setIsRedirecting]);

  const { handleSubmit, register, formState } = useForm<FormValues>({
    mode: 'onChange',
  });

  const registerEmailProps = register('email', {
    pattern: {
      value: EMAIL_REGEX,
      message: t('users.errors.invalidEmail'),
    },
    maxLength: {
      value: EMAIL_MAX_LENGTH,
      message: t('users.errors.longEmail'),
    },
    required: t('users.errors.missingEmail'),
  });

  const registerNameProps = register('name', {
    pattern: {
      value: NAME_REGEX,
      message: t('users.errors.invalidName'),
    },
    minLength: {
      value: NAME_MIN_LENGTH,
      message: t('users.errors.shortName'),
    },
    maxLength: {
      value: NAME_MAX_LENGTH,
      message: t('users.errors.longName'),
    },
  });

  const registerPasswordProps = register('password', {
    minLength: {
      value: PASSWORD_MIN_LENGTH,
      message: t('users.errors.passwordTooShort'),
    },
    maxLength: {
      value: PASSWORD_MAX_LENGTH,
      message: t('users.errors.passwordTooLong'),
    },
    required: t('users.errors.missingPassword'),
  });

  const showPasswordIconSx: SxProps = {
    color: isDarkMode ? GRAY['300'] : GRAY['900'],
  };
  const inputBaseSx: SxProps = {
    '&:-webkit-autofill': {
      WebkitBoxShadow: `0 0 0 100px ${isDarkMode ? GRAY['800'] : GRAY['100']} inset`,
      WebkitTextFillColor: isDarkMode ? GRAY['100'] : GRAY['1000'],
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

  const isPending = isSignUpPending || isUpgradeAnonPending;
  const isSignedUp = meData && meData.user.anonymous === false;
  const isAnon = meData && meData.user.anonymous === true;

  const subheader = t(
    isAnon ? 'users.prompts.upgradeAccount' : 'users.prompts.signUpSubtext',
  );

  if (isMeLoading || isRedirecting || isSignedUp) {
    return <ProgressBar />;
  }

  return (
    <>
      <TopNav />

      <Card>
        <CardHeader
          title={t('users.prompts.createAccount')}
          subheader={subheader}
          sx={{ paddingBottom: 0 }}
        />
        <CardContent>
          <form
            onSubmit={handleSubmit((fv) =>
              isAnon ? upgradeAnon(fv) : signUp(fv),
            )}
          >
            <FormGroup sx={{ gap: 1.5, paddingBottom: 3 }}>
              {!isLoggedIn && (
                <FormControl>
                  <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                    {t('users.form.username')}
                  </FormLabel>
                  <OutlinedInput
                    autoComplete="off"
                    inputProps={{ sx: inputBaseSx }}
                    {...registerNameProps}
                  />
                  <FormHelperText sx={{ marginLeft: 0.15 }}>
                    {t('users.prompts.usernameHelper')}
                  </FormHelperText>
                  {!!formState.errors.name && (
                    <Typography color="error" fontSize="small" paddingTop={0.5}>
                      {formState.errors.name.message}
                    </Typography>
                  )}
                </FormControl>
              )}

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

            <PrimaryButton
              type="submit"
              sx={{ height: 45 }}
              disabled={isPending}
              fullWidth
            >
              {t('users.actions.signUp')}
            </PrimaryButton>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default SignUp;
