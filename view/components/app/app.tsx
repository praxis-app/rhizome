import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useAppStore from '../../store/app.store';
import theme from '../../styles/theme';
import { getToneJS } from '../../utils/audio.utils';
import { isTouchDevice } from '../../utils/shared.utils';
import Layout from './layout';

const App = () => {
  const {
    isAudioEnabled,
    setIsAppLoading,
    setIsAudioEnabled,
    setToken,
    token,
  } = useAppStore((state) => state);

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

  useEffect(() => {
    const enableAudio = async () => {
      if (isAudioEnabled) {
        return;
      }

      const Tone = await getToneJS();
      await Tone.start();

      setIsAudioEnabled(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ['Space', 'Enter', 'Key', 'Digit'].some((key) => e.code.includes(key))
      ) {
        enableAudio();
      }
    };

    // Prevent context menu for long-press on mobile
    const handleContextMenu = (e: MouseEvent) => {
      if (isTouchDevice()) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', enableAudio);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', enableAudio);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isAudioEnabled, setIsAudioEnabled]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Outlet />
      </Layout>
    </ThemeProvider>
  );
};

export default App;
