import React, { createContext, useState, useCallback } from 'react';
import type { UserWithNoPassword } from '../types/DBTypes';

type UserContextType = {
  user: UserWithNoPassword | null;
  setUser: (user: UserWithNoPassword | null) => void;
};

export const UserContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUserState] = useState<UserWithNoPassword | null>(null);
  const setUser = useCallback((u: UserWithNoPassword | null) => {
    setUserState(u);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
  );
};
