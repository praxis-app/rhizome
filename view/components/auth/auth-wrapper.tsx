import {
  LinearProgress,
  linearProgressClasses,
  LinearProgressProps,
  styled,
} from '@mui/material';
import { ReactNode } from 'react';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';

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

interface Props {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: Props) => {
  const { isAppLoading, setIsAppLoading, setIsLoggedIn } = useAppStore(
    (state) => state,
  );

  /**
   * TODO: Move away from onSuccess and onError callbacks
   * Ref: https://stackoverflow.com/a/76961109/2034099
   */
  useMeQuery({
    onSuccess: () => {
      setIsLoggedIn(true);
      setIsAppLoading(false);
    },
    onError: () => {
      localStorage.removeItem('token');
      setIsAppLoading(false);
    },
    retry: false,
  });

  // TODO: Uncomment after moving to the new auth flow

  // const getClientId = () => {
  //   const clientId = localStorage.getItem('clientId');
  //   if (!clientId) {
  //     const newClientId = uuidv4();
  //     localStorage.setItem('clientId', newClientId);
  //     return newClientId;
  //   }
  //   return clientId;
  // };

  // const { mutate: createAnonSession } = useMutation(async () => {
  //   const clientId = getClientId();
  //   const { token } = await api.createAnonSession(clientId);
  //   localStorage.setItem('token', token);
  //   setToken(token);
  // });

  // useEffect(() => {
  //   if (token || authCalledRef.current) {
  //     return;
  //   }
  //   const tokenFromStorage = localStorage.getItem('token');
  //   if (tokenFromStorage) {
  //     setToken(tokenFromStorage);
  //     return;
  //   }
  //   createAnonSession();
  //   authCalledRef.current = true;
  // }, [token, createAnonSession, setToken, setIsAppLoading]);

  // useEffect(() => {
  //   if (meData && token) {
  //     setIsAppLoading(false);
  //   }
  // }, [meData, token, setIsAppLoading]);

  if (isAppLoading) {
    return <ProgressBar />;
  }

  return <>{children}</>;
};
