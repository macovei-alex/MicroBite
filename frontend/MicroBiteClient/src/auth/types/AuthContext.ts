import { createContext } from "react";
import { JwtClaims } from "./JwtClaims";

type AuthContextType = {
  accessToken: string | null | undefined;
  jwtClaims: JwtClaims | null;
  isAuthenticated: () => boolean;
  isAuthenticating: boolean;
  login: (email: string, password: string) => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
