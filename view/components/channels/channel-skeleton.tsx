import { Box, Skeleton } from '@mui/material';

const MessageSkeleton = () => (
  <Box display="flex" gap={1}>
    <Skeleton
      variant="circular"
      width={40}
      height={40}
      sx={{ marginTop: 0.5 }}
    />
    <Box flex={1}>
      <Skeleton variant="text" width={100} />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </Box>
  </Box>
);

const ChannelSkeleton = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      padding={2}
    >
      <Skeleton height={45} variant="rounded" />

      <Box display="flex" gap={3} flexDirection="column">
        <Box display="flex" gap={3} flexDirection="column">
          {Array.from({ length: 3 }).map((_, index) => (
            <MessageSkeleton key={index} />
          ))}
        </Box>

        <Skeleton height={80} variant="rounded" />
      </Box>
    </Box>
  );
};

export default ChannelSkeleton;
