import { ArrowBack, ChevronRight, Search, Tag } from '@mui/icons-material';
import { Box, Button, IconButton, SxProps, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAboveBreakpoint, useIsDarkMode } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';
import { Channel } from '../../types/channel.types';
import EditChannelDrawer from './edit-channel-drawer';

interface Props {
  channel: Channel;
}

const ChannelTopNav = ({ channel }: Props) => {
  const { setIsNavDrawerOpen } = useAppStore((state) => state);
  const [isEditChannelDrawerOpen, setIsEditChannelDrawerOpen] = useState(false);

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const isAboveMd = useAboveBreakpoint('md');

  const buttonSx: SxProps = {
    width: 38,
    height: 38,
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderBottom={`1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}`}
      bgcolor="background.paper"
      paddingRight={2.4}
      paddingLeft={2.5}
      height="55px"
    >
      <Box display="flex" alignItems="center">
        {!isAboveMd && (
          <IconButton
            onClick={() => setIsNavDrawerOpen(true)}
            sx={{ ...buttonSx, marginRight: 0.5 }}
            edge="start"
          >
            <ArrowBack />
          </IconButton>
        )}

        <Button
          sx={{
            '&:hover': {
              backgroundColor: isAboveMd ? 'transparent' : undefined,
              cursor: isAboveMd ? 'default' : undefined,
            },
            textTransform: 'none',
          }}
          disableRipple={isAboveMd}
          onClick={() => {
            if (!isAboveMd) {
              setIsEditChannelDrawerOpen(true);
            }
          }}
        >
          <Tag
            sx={{
              marginRight: '0.4ch',
              color: 'text.secondary',
            }}
            fontSize={isAboveMd ? 'medium' : 'small'}
          />
          <Typography
            sx={{ userSelect: 'none' }}
            fontWeight={700}
            fontSize="15px"
          >
            {channel.name}
          </Typography>

          {!isAboveMd && (
            <ChevronRight
              sx={{ color: 'text.secondary', marginTop: '1px' }}
              fontSize="small"
            />
          )}
        </Button>
      </Box>

      {!isAboveMd && (
        <EditChannelDrawer
          editChannel={channel}
          isOpen={isEditChannelDrawerOpen}
          setIsOpen={setIsEditChannelDrawerOpen}
        />
      )}

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

export default ChannelTopNav;
