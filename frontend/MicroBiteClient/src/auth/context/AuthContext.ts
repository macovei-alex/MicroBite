import { createContext } from "react";

type AuthContextType = {
  accessToken: string | null | undefined;
  isAuthenticated: () => boolean;
  isAuthenticating: boolean;
  login: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
