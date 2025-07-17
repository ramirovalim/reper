import { createContext } from 'react';
import { AuthContextType } from '@/types/user';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AuthContext.Provider value={{ user: null, setUser: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
};
