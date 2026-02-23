import type { User, UserWithNoPassword } from './DBTypes';

type Credentials = Pick<User, 'username' | 'password'>;

type RegisterCredentials = Pick<User, 'username' | 'password' | 'email'>;

type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
};

export type { AuthContextType, Credentials, RegisterCredentials };
