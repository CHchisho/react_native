import React, {createContext, useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {UserWithNoPassword} from '../types/DBTypes';
import type {
  AuthContextType,
  Credentials,
  UserUpdateCredentials,
} from '../types/LocalTypes';
import {useAuthentication, useUser} from '../hooks/apiHooks';

const TOKEN_KEY = 'token';

export const UserContext = createContext<AuthContextType | null>(null);

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider = ({children}: UserProviderProps) => {
  const [user, setUserState] = useState<UserWithNoPassword | null>(null);
  const {postLogin} = useAuthentication();
  const {getUserByToken, putUser} = useUser();

  const setUser = useCallback((u: UserWithNoPassword | null) => {
    setUserState(u);
  }, []);

  const handleAutoLogin = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) return;
      const userResult = await getUserByToken(token);
      setUserState(userResult.user);
    } catch (e) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      console.log((e as Error).message);
    }
  }, []);

  const handleLogin = useCallback(
    async (credentials: Credentials) => {
      try {
        const loginResult = await postLogin(credentials);
        await AsyncStorage.setItem(TOKEN_KEY, loginResult.token);
        setUserState(loginResult.user);
      } catch (e) {
        console.log((e as Error).message);
      }
    },
    [postLogin],
  );

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setUserState(null);
    } catch (e) {
      console.log((e as Error).message);
    }
  }, []);

  const handleUpdateProfile = async (data: UserUpdateCredentials) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) return;
      const result = await putUser(token, data);
      setUserState(result.user);
    } catch (e) {
      console.log((e as Error).message);
      throw e;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        handleLogin,
        handleLogout,
        handleAutoLogin,
        handleUpdateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
