import axios from 'axios';
import { ReactNode, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useAppStore } from '../../store/app.store';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: Props) => {
  const { token, setToken, setIsAppLoading } = useAppStore((state) => state);

  const { mutate: register, isLoading } = useMutation(async () => {
    const body = { clientId: uuidv4() };
    const { data } = await axios.post<{ token: string }>('/api/auth', body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.setItem('clientId', body.clientId);
    localStorage.setItem('token', data.token);
    setIsAppLoading(false);
    setToken(data.token);
  });

  useEffect(() => {
    if (token || isLoading) {
      return;
    }
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      setIsAppLoading(false);
      return;
    }
    register();
  }, [token, register, setToken, setIsAppLoading, isLoading]);

  return <>{children}</>;
};
