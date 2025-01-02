import {
  Container,
  CssBaseline,
  LinearProgress,
  linearProgressClasses,
  LinearProgressProps,
  styled,
  SxProps,
  ThemeProvider,
} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import { theme } from '../../styles/theme';
import Toast from '../shared/toast';

const ProgressBar = styled(LinearProgress)<LinearProgressProps>(
  ({ theme }) => ({
    [`&.${linearProgressClasses.colorPrimary}`]: {
      ...theme.applyStyles('dark', {
        backgroundColor: '#09090b',
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      ...theme.applyStyles('dark', {
        backgroundColor: '#18181b',
      }),
    },
    height: '100vh',
  }),
);

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
  sx?: SxProps;
}

export const Layout = ({ children, sx }: Props) => {
  const { isAppLoading } = useAppStore((state) => state);

  useMeQuery({ retry: false });

  if (isAppLoading) {
    return <ProgressBar />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        <Container maxWidth="sm" sx={sx}>
          {children}
          <Toast />
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
