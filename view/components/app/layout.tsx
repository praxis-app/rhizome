import { Container, LinearProgress, SxProps } from '@mui/material';
import { ReactNode } from 'react';
import { useAppStore } from '../../store/app.store';

interface Props {
  children: ReactNode;
  sx?: SxProps;
}

export const Layout = ({ children, sx }: Props) => {
  const isLoading = useAppStore((state) => state.isAppLoading);

  if (isLoading) {
    return <LinearProgress sx={{ height: '100vh' }} />;
  }

  return <Container sx={sx}>{children}</Container>;
};
