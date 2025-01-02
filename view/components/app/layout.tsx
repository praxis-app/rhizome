import { Container, CssBaseline, SxProps, ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '../../styles/theme';
import { AuthWrapper } from '../auth/auth-wrapper';
import Toast from '../shared/toast';

interface Props {
  children: ReactNode;
  sx?: SxProps;
}

const queryClient = new QueryClient();

export const Layout = ({ children, sx }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        <AuthWrapper>
          <Container maxWidth="sm" sx={sx}>
            {children}
            <Toast />
          </Container>
        </AuthWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
