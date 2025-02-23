import { Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAppStore } from '../../store/app.store';
import BotMessage from '../messages/bot-message';

const WelcomeMessage = () => {
  const { inviteToken } = useAppStore((state) => state);

  const { data } = useQuery({
    queryKey: ['is-first-user'],
    queryFn: api.isFirstUser,
  });

  const signUpPath = data?.isFirstUser
    ? NavigationPaths.SignUp
    : `${NavigationPaths.SignUp}/${inviteToken}`;

  const showSignUp = data?.isFirstUser || !!inviteToken;

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <BotMessage bodySx={{ paddingTop: 0.9 }}>
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        {t('prompts.welcomeToPraxis')}
      </Typography>

      <Typography sx={{ marginBottom: 1.5 }}>
        {t('welcome.messages.projectDescription1')}
      </Typography>

      <Typography sx={{ marginBottom: 1.5 }}>
        {t('welcome.messages.projectDescription2')}
      </Typography>

      <Typography sx={{ marginBottom: 1.5 }}>
        {t('welcome.messages.inDev')}
      </Typography>

      {showSignUp && (
        <Button
          variant="contained"
          onClick={() => navigate(signUpPath)}
          sx={{ textTransform: 'uppercase', marginRight: '12px' }}
        >
          {t('users.actions.signUp')}
        </Button>
      )}

      <Button
        variant="contained"
        onClick={() => navigate(NavigationPaths.Login)}
        sx={{ textTransform: 'uppercase' }}
      >
        {t('users.actions.logIn')}
      </Button>
    </BotMessage>
  );
};

export default WelcomeMessage;
