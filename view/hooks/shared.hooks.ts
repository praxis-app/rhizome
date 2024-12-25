// TODO: Consider breaking up into multiple files

import {
  Breakpoint,
  useColorScheme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { RefObject, useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { BrowserEvents } from '../constants/shared.constants';
import { useAppStore } from '../store/app.store';
import { PubSubMessage, SubscriptionOptions } from '../types/shared.types';
import { getWebSocketURL } from '../utils/shared.utils';

const RESET_SCROLL_DIRECTION_TIMEOUT = 700;
const RESET_SCROLL_DIRECTION_THRESHOLD = 40;

type ScrollDirection = 'up' | 'down' | null;

export const useScrollDirection = (
  scrollableRef: RefObject<HTMLElement>,
  resetTimeout = RESET_SCROLL_DIRECTION_TIMEOUT,
) => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const previousScrollTop = useRef(0);

  useEffect(() => {
    if (!scrollableRef.current) {
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;

    // Initialize with the current scroll position
    previousScrollTop.current = scrollableRef.current.scrollTop;

    const handleScroll = () => {
      const currentScrollTop = scrollableRef.current!.scrollTop;

      if (previousScrollTop.current > currentScrollTop) {
        setScrollDirection('up');
      } else if (previousScrollTop.current < currentScrollTop) {
        setScrollDirection('down');
      }

      previousScrollTop.current = currentScrollTop;

      // Reset scroll direction after some time if near top
      if (currentScrollTop < RESET_SCROLL_DIRECTION_THRESHOLD) {
        timeout = setTimeout(() => {
          setScrollDirection(null);
        }, resetTimeout);
      }
    };

    scrollableRef.current.addEventListener(BrowserEvents.Scroll, handleScroll, {
      passive: true,
    });

    return () => {
      if (scrollableRef.current) {
        scrollableRef.current.removeEventListener(
          BrowserEvents.Scroll,
          handleScroll,
        );
      }
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [scrollableRef]);

  return scrollDirection;
};

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

export const useInView = (
  ref: RefObject<HTMLElement>,
  rootMargin = '0px',
  onView?: () => void,
) => {
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
          onView?.();
        }
        setInView(entry.isIntersecting);
      },
      { rootMargin },
    );
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, rootMargin, onView]);

  return { inView, setInView, viewed, setViewed };
};
