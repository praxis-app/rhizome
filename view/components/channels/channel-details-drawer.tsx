import { ChevronRight, Settings, Tag } from '@mui/icons-material';
import { Box, Divider, Drawer, PaperProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { GRAY } from '../../styles/theme';
import { Channel } from '../../types/channel.types';
import EditChannelDrawer from './edit-channel-drawer';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  channel: Channel;
}

const ChannelDetailsDrawer = ({ isOpen, setIsOpen, channel }: Props) => {
  const [isEditChannelDrawerOpen, setIsEditChannelDrawerOpen] = useState(false);

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();

  const paperProps: PaperProps = {
    sx: {
      height: 'calc(100% - 54px)',
      bgcolor: GRAY['900'],
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      paddingTop: '12px',
    },
  };

  return (
    <Drawer
      open={isOpen}
      onClose={() => setIsOpen(false)}
      anchor="bottom"
      PaperProps={paperProps}
    >
      <Box display="flex" justifyContent="center" paddingY={1}>
        <Tag sx={{ alignSelf: 'center' }} />
        <Typography fontSize="20px" fontWeight={600}>
          {channel.name}
        </Typography>
      </Box>

      {channel.description && (
        <Typography textAlign="center">{channel.description}</Typography>
      )}

      <Divider sx={{ marginTop: 1.25, marginBottom: 3 }} />

      <Box paddingX="16px">
        <Box
          sx={{
            cursor: 'pointer',
            userSelect: 'none',
            boxShadow: isDarkMode
              ? 'none'
              : '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1);',
            border: isDarkMode ? 'none' : `1px solid ${GRAY[100]}`,
          }}
          display="flex"
          justifyContent="space-between"
          bgcolor={isDarkMode ? 'rgba(255, 255, 255, 0.045)' : GRAY[50]}
          onClick={() => setIsEditChannelDrawerOpen(true)}
          borderRadius="8px"
          padding="14px"
          width="100%"
        >
          <Box display="flex" gap={1.5}>
            <Settings />
            {t('channels.headers.channelSettings')}
          </Box>
          <ChevronRight />
        </Box>
      </Box>

      <EditChannelDrawer
        editChannel={channel}
        isOpen={isEditChannelDrawerOpen}
        setIsOpen={setIsEditChannelDrawerOpen}
      />
    </Drawer>
  );
};

export default ChannelDetailsDrawer;
