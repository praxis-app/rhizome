import { ReactNode, useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import { api } from '../../client/api-client';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';

interface Props {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: Props) => {
  const { token, setToken, setIsAppLoading } = useAppStore((state) => state);
  const { data: meData } = useMeQuery({ enabled: !!token });
  const authCalledRef = useRef(false);

  const getClientId = () => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId) {
      const newClientId = uuidv4();
      localStorage.setItem('clientId', newClientId);
      return newClientId;
    }
    return clientId;
  };

  const { mutate: register } = useMutation(async () => {
    const clientId = getClientId();
    const { token } = await api.register(clientId);
    localStorage.setItem('token', token);
    setToken(token);
  });

  useEffect(() => {
    if (token || authCalledRef.current) {
      return;
    }
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      return;
    }
    register();
    authCalledRef.current = true;
  }, [token, register, setToken, setIsAppLoading]);

  useEffect(() => {
    if (meData && token) {
      setIsAppLoading(false);
    }
  }, [meData, token, setIsAppLoading]);

  return <>{children}</>;
};
