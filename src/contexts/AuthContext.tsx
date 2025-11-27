import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

const USER_URL = 'https://fakestoreapi.com/users/1';

type AuthContextValue = {
  user: User | null;
  loadingUser: boolean;
  login: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const login = useCallback(async () => {
    setLoadingUser(true);
    try {
      const response = await fetch(USER_URL);
      if (!response.ok) {
        throw new Error('Não foi possível carregar o usuário.');
      }
      const userData: User = await response.json();
      setUser(userData);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loadingUser,
      login,
      logout,
    }),
    [user, loadingUser, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };


