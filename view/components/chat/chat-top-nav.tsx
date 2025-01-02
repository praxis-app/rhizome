import { ArrowBack, Search, Tag } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Channel } from '../../types/chat.types';

interface Props {
  channel: Channel;
}

const ChatTopNav = ({ channel }: Props) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      height="55px"
      bgcolor="background.paper"
      alignItems="center"
      justifyContent="space-between"
      paddingX={2}
    >
      <Box display="flex" alignItems="center">
        <IconButton sx={{ marginRight: 0.5 }} edge="start">
          <ArrowBack />
        </IconButton>
        <Tag
          sx={{ marginRight: '0.25ch', color: 'text.secondary' }}
          fontSize="small"
        />
        <Typography fontWeight={600} fontSize="15px">
          {channel.name}
        </Typography>
      </Box>

      <IconButton aria-label={t('labels.menu')} edge="end" size="large">
        <Search />
      </IconButton>
    </Box>
  );
};

export default ChatTopNav;
