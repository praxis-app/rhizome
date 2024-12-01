import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAboveBreakpoint } from '../hooks/shared.hooks';
import { useAppStore } from '../store/app.store';

export const HomePage = () => {
  const token = useAppStore((state) => state.token);
  const [time, setTime] = useState<string>();

  const isAboveMd = useAboveBreakpoint('md');
  const isAboveLg = useAboveBreakpoint('lg');

  useEffect(() => {
    if (!token) {
      return;
    }
    const init = async () => {
      const result = await fetch('/api/health', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: { timestamp: string } = await result.json();
      setTime(data.timestamp);
    };
    init();
  }, [token]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={isAboveMd ? '4px' : '16px'}
      paddingLeft={isAboveLg ? 0 : '70px'}
      paddingTop={isAboveLg ? 0 : '20px'}
    >
      {time && (
        <Box
          position="fixed"
          bottom={10}
          right={10}
          width="fit-content"
          height={10}
        >
          <Typography
            fontSize="8px"
            color="text.secondary"
            borderRadius="2px"
            paddingX={0.3}
            sx={{
              '&:hover': { color: 'text.primary' },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {time}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
