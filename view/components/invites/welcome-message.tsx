import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BotMessage from '../messages/bot-message';

const WelcomeMessage = () => {
  const { t } = useTranslation();

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

      <Typography>{t('welcome.messages.inDev')}</Typography>
    </BotMessage>
  );
};

export default WelcomeMessage;
