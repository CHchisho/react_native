import type { User, UserWithNoPassword } from './DBTypes';

type Credentials = Pick<User, 'username' | 'password'>;

type RegisterCredentials = Pick<User, 'username' | 'password' | 'email'>;

type AuthContextType = {
  user: UserWithNoPassword | null;
  setUser: (user: UserWithNoPassword | null) => void;
  handleLogin: (credentials: Credentials) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleAutoLogin: () => Promise<void>;
};

export type { AuthContextType, Credentials, RegisterCredentials };
