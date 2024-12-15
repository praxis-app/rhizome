import {
  Breakpoint,
  useColorScheme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { RefObject, useEffect, useState } from 'react';
import useWebSocket, { Options } from 'react-use-websocket';
import { useAppStore } from '../store/app.store';
import { PubSubMessage } from '../types/shared.types';
import { getWebSocketURL } from '../utils/shared.utils';

export interface SubscriptionOptions extends Options {
  enabled?: boolean;
}

export const useSubscription = (
  channel: string,
  options?: SubscriptionOptions,
) => {
  const token = useAppStore((state) => state.token);
  const isEnabled = options?.enabled ?? true;

  const getOptions = () => {
    if (!options || !options.onMessage) {
      return options;
    }
    const onMessage = (event: MessageEvent) => {
      const message: PubSubMessage = JSON.parse(event.data);
      // Ignore messages from other channels
      if (message.channel !== channel || !options.onMessage) {
        return;
      }
      // Log errors from the server
      if (message.type === 'RESPONSE' && message.error) {
        console.error(message.error);
        return;
      }
      options.onMessage(event);
    };
    return { ...options, onMessage };
  };

  const { sendMessage, readyState, ...rest } = useWebSocket(getWebSocketURL(), {
    // Ensure multiple channels can be subscribed to in
    // the same component with `share` set to `true`
    share: true,
    shouldReconnect: () => !!token,
    ...getOptions(),
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    if (isEnabled && readyState === WebSocket.OPEN) {
      const message: PubSubMessage = {
        type: 'REQUEST',
        request: 'SUBSCRIBE',
        channel,
        token,
      };
      sendMessage(JSON.stringify(message));
    }
  }, [channel, isEnabled, readyState, sendMessage, token]);

  return { sendMessage, ...rest };
};

export const useIsDarkMode = () => {
  const [prefersDarkMode, setPrefersDarkMode] = useState(false);
  const { mode } = useColorScheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setPrefersDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) =>
      setPrefersDarkMode(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (mode === 'system') {
    return prefersDarkMode;
  }

  return mode === 'dark';
};

export const useAboveBreakpoint = (breakpoint: Breakpoint) =>
  useMediaQuery(useTheme().breakpoints.up(breakpoint));

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return [screenSize.width, screenSize.height];
};

export const useInView = (ref: RefObject<HTMLElement>, rootMargin = '0px') => {
  const [inView, setInView] = useState(false);
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    const isBrowserCompatible = 'IntersectionObserver' in window;
    if (!isBrowserCompatible) {
      setInView(true);
      setViewed(true);
      return;
    }
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setViewed(true);
        }
        setInView(entry.isIntersecting);
      },
      { rootMargin },
    );
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, rootMargin]);

  return { inView, setInView, viewed, setViewed };
};
