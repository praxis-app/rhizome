import { Container, CssBaseline, SxProps, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { theme } from '../../styles/theme';
import { AuthWrapper } from '../auth/auth-wrapper';
import Toast from '../shared/toast';
import NavDrawer from './nav-drawer';

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
  sx?: SxProps;
}

export const Layout = ({ children, sx }: Props) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <AuthWrapper>
        <NavDrawer />
        <Container maxWidth="sm" sx={sx}>
          {children}
          <Toast />
        </Container>
      </AuthWrapper>
    </ThemeProvider>
  </QueryClientProvider>
);
