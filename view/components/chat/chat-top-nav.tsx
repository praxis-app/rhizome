import { ArrowBack, Search, Tag } from '@mui/icons-material';
import { Box, IconButton, SxProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/app.store';
import { Channel } from '../../types/chat.types';

interface Props {
  channel: Channel;
}

const ChatTopNav = ({ channel }: Props) => {
  const { setIsNavDrawerOpen } = useAppStore((state) => state);
  const { t } = useTranslation();

  const buttonSx: SxProps = {
    width: 38,
    height: 38,
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="background.paper"
      paddingRight={2.4}
      paddingLeft={2.5}
      height="55px"
    >
      <Box display="flex" alignItems="center">
        <IconButton
          onClick={() => setIsNavDrawerOpen(true)}
          sx={{ ...buttonSx, marginRight: 0.5 }}
          edge="start"
        >
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

      <IconButton
        sx={buttonSx}
        aria-label={t('labels.menu')}
        size="large"
        edge="end"
      >
        <Search />
      </IconButton>
    </Box>
  );
};

export default ChatTopNav;
