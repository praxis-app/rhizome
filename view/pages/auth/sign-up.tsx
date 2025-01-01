import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
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
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import PrimaryButton from '../../components/shared/primary-button';
import ProgressBar from '../../components/shared/progress-bar';
import { NavigationPaths } from '../../constants/shared.constants';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';
import { UserStatus } from '../../types/user.types';

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

export const SignUp = () => {
  const { setToast, isLoggedIn, setIsLoggedIn } = useAppStore((state) => state);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: signUp, isLoading: isSignUpLoading } = useMutation(
    api.signUp,
    {
      onSuccess: ({ token }) => {
        localStorage.setItem('token', token);
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
    },
  );

  const { mutate: upgradeAnon, isLoading: isUpgradeAnonLoading } = useMutation(
    api.upgradeAnonSession,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('me');
        navigate(NavigationPaths.Home);
        setIsRedirecting(true);
      },
      onError: (error: Error) => {
        setToast({
          title: error.message,
          status: 'error',
        });
      },
    },
  );

  const { data: meData, isLoading: isMeLoading } = useMeQuery({
    onSuccess(data) {
      if (data.user.status !== UserStatus.ANONYMOUS) {
        navigate(NavigationPaths.Home);
        setIsRedirecting(true);
      }
    },
    enabled: isLoggedIn,
    retry: false,
  });

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      WebkitTextFillColor: isDarkMode ? GRAY['100'] : GRAY['950'],
    },
  };
  const passwordInputSx: SxProps | undefined = isAutofilled
    ? {
        backgroundColor: isDarkMode ? GRAY['800'] : GRAY['100'],
      }
    : undefined;

  // TODO: Account for user clearing the password field
  useEffect(() => {
    const handleAnimationStart = (e: AnimationEvent) => {
      if (e.animationName === 'mui-auto-fill') {
        setIsAutofilled(true);
      }
    };
    document.addEventListener('animationstart', handleAnimationStart);

    return () => {
      document.removeEventListener('animationstart', handleAnimationStart);
    };
  }, []);

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

  const isLoading = isSignUpLoading || isUpgradeAnonLoading;
  const isAnon = meData && meData.user.status === UserStatus.ANONYMOUS;
  const isSignedUp = meData && meData.user.status !== UserStatus.ANONYMOUS;

  if (isMeLoading || isRedirecting || isSignedUp) {
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
        <form
          onSubmit={handleSubmit((fv) =>
            isAnon ? upgradeAnon(fv) : signUp(fv),
          )}
        >
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
                {!!formState.errors.name && (
                  <Typography color="error" fontSize="small" paddingTop={0.5}>
                    {formState.errors.name.message}
                  </Typography>
                )}
              </FormControl>
            )}

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
                sx={passwordInputSx}
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
            disabled={isLoading}
            fullWidth
          >
            {t('users.actions.signUp')}
          </PrimaryButton>
        </form>
      </CardContent>
    </Card>
  );
};
