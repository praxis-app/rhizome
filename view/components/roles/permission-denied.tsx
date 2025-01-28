import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TopNav, { TopNavProps } from '../nav/top-nav';

interface Props extends BoxProps {
  topNavProps?: TopNavProps;
}

const PermissionDenied = ({ topNavProps, ...boxProps }: Props) => {
  const { t } = useTranslation();

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      gap="40px"
      paddingTop="115px"
      textAlign="center"
      {...boxProps}
    >
      <TopNav {...topNavProps} />
      <Typography>{t('prompts.permissionDenied')}</Typography>
    </Box>
  );
};

export default PermissionDenied;
