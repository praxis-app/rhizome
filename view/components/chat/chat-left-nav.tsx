import { Box } from '@mui/material';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { GRAY } from '../../styles/theme';

const ChatLeftNav = () => {
  const isDarkMode = useIsDarkMode();

  return (
    <Box
      width="220px"
      bgcolor="background.paper"
      borderRight="1px solid"
      borderColor={isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}
    >
      {/* TODO: Show channel list here */}
    </Box>
  );
};

export default ChatLeftNav;
