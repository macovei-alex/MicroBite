import axios from "axios";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { api, config } from "../api";

type AuthContextType = {
  accessToken: string | null | undefined;
  isAuthenticated: () => boolean;
  isAuthenticating: boolean;
  login: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null | undefined>(undefined);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const isAuthenticated = useCallback(() => {
    return accessToken !== null && accessToken !== undefined;
  }, [accessToken]);

  const tryRefreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post(
        `${config.AUTH_BASE_URL}/refresh`,
        {},
        { withCredentials: true }
      );
      console.log("Access token received: ", response.data.accessToken);
      setAccessToken(() => response.data.accessToken);
    } catch (error) {
      console.warn("Access token refresh failed: ", error);
      setAccessToken(() => null);
    }
  }, [setAccessToken]);

  useEffect(() => {
    (async function () {
      setIsAuthenticating(() => true);
      await tryRefreshAccessToken();
      setIsAuthenticating(() => false);
    })();
  }, [setIsAuthenticating, tryRefreshAccessToken]);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization = accessToken
        ? `Bearer ${accessToken}`
        : config.headers.Authorization;
      console.log("Request headers: ", config.headers);
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [accessToken]);

  useLayoutEffect(() => {
    const authResponseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          await tryRefreshAccessToken();
          if (isAuthenticated()) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
        return error;
      }
    );

    return () => {
      api.interceptors.response.eject(authResponseInterceptor);
    };
  }, [accessToken, setAccessToken, isAuthenticated, tryRefreshAccessToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsAuthenticating(() => true);
      try {
        const response = await axios.post(
          `${config.AUTH_BASE_URL}/login`,
          { email, password },
          { withCredentials: true }
        );
        setAccessToken(() => response.data.accessToken);
      } catch (error) {
        console.error(error);
      } finally {
        setIsAuthenticating(() => false);
      }
    },
    [setAccessToken, setIsAuthenticating]
  );

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated, isAuthenticating, login }}>
      {children}
    </AuthContext.Provider>
  );
}
