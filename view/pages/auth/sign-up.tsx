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

const VALID_EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const EMAIL_MAX_LENGTH = 254;

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

interface FormValues {
  email: string;
  password: string;
}

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { setToast } = useAppStore((state) => state);

  const { mutate: signUp, isLoading } = useMutation(api.signUp, {
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
  });

  const { data: meData, isLoading: isMeLoading } = useMeQuery({
    onSuccess(data) {
      if (data.user.status !== UserStatus.ANONYMOUS) {
        navigate(NavigationPaths.Home);
        setIsRedirecting(true);
      }
    },
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
      value: VALID_EMAIL_REGEX,
      message: t('users.errors.invalidEmail'),
    },
    maxLength: {
      value: EMAIL_MAX_LENGTH,
      message: t('users.errors.longEmail'),
    },
    required: t('users.errors.missingEmail'),
  });

  const registerPasswordProps = register('password', {
    minLength: {
      value: MIN_PASSWORD_LENGTH,
      message: t('users.errors.passwordTooShort'),
    },
    maxLength: {
      value: MAX_PASSWORD_LENGTH,
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
        <form onSubmit={handleSubmit((fv) => signUp(fv))}>
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
