import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/app.store';
import { theme } from '../../styles/theme';
import { Layout } from './layout';

export const App = () => {
  const { setIsAppLoading, setToken, token } = useAppStore((state) => state);

  useEffect(() => {
    if (token) {
      return;
    }

    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      setIsAppLoading(false);
      return;
    }

    const init = async () => {
      const result = await fetch('/api/auth', { method: 'POST' });
      const data: { token: string } = await result.json();
      localStorage.setItem('token', data.token);
      setIsAppLoading(false);
      setToken(data.token);
    };
    init();
  }, [token, setToken, setIsAppLoading]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Outlet />
      </Layout>
    </ThemeProvider>
  );
};
