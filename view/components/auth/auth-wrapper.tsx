import axios from 'axios';
import { ReactNode, useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import { useAppStore } from '../../store/app.store';

interface Props {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: Props) => {
  const { token, setToken, setIsAppLoading } = useAppStore((state) => state);
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
    const body = { clientId: getClientId() };
    const { data } = await axios.post<{ token: string }>('/api/auth', body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.setItem('token', data.token);
    setIsAppLoading(false);
    setToken(data.token);
  });

  useEffect(() => {
    if (token || authCalledRef.current) {
      return;
    }
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      setIsAppLoading(false);
      return;
    }
    register();
    authCalledRef.current = true;
  }, [token, register, setToken, setIsAppLoading]);

  return <>{children}</>;
};
