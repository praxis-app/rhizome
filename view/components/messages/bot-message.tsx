import { Box, BoxProps, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import appIconImg from '../../assets/images/app-icon.png';
import { timeAgo } from '../../utils/time.utils';
import UserAvatar from '../users/user-avatar';

interface Props extends BoxProps {
  children: ReactNode;
  bodySx?: BoxProps['sx'];
}

const BotMessage = ({ children, bodySx, ...boxProps }: Props) => {
  const { t } = useTranslation();
  const formattedDate = timeAgo(Date());

  return (
    <Box display="flex" gap={2} paddingBottom={2} {...boxProps}>
      <UserAvatar imageSrc={appIconImg} sx={{ marginTop: 0.5 }} />

      <Box>
        <Box display="flex" gap={0.9}>
          <Typography fontFamily="Inter" fontWeight={600}>
            {t('messages.names.praxisBot')}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ cursor: 'default', fontSize: '14px', marginTop: 0.15 }}
            title={formattedDate}
          >
            {formattedDate}
          </Typography>
        </Box>

        <Box sx={bodySx}>{children}</Box>
      </Box>
    </Box>
  );
};

export default BotMessage;
