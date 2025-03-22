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
import { config } from "../api/config";
import { api } from "../api";

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

  useEffect(() => {
    setIsAuthenticating(() => true);
    axios
      .post(`${config.AUTH_BASE_URL}/refresh`, {}, { withCredentials: true })
      .then((res) => {
        if (res.status === axios.HttpStatusCode.Ok) {
          console.log("Access token received: ", res.data.accessToken);
          setAccessToken(() => res.data.accessToken);
        } else {
          console.log("Access token refresh failed: ", res);
          setAccessToken(() => null);
        }
      })
      .catch((error) => {
        console.error("Access token refresh failed: ", error);
        setAccessToken(() => null);
      })
      .finally(() => {
        setIsAuthenticating(() => false);
      });
  }, [setAccessToken]);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization = accessToken
        ? `Bearer ${accessToken}`
        : config.headers.Authorization;
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [accessToken]);

  useLayoutEffect(() => {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const originalResult = await axios
            .post(`${config.AUTH_BASE_URL}/refresh`, {}, { withCredentials: true })
            .then((res) => {
              console.log(`Refresh endpoint response: ${res}`);

              setAccessToken(() => res.data.accessToken);
              originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
              return api(originalRequest);
            })
            .catch((refreshError) => {
              console.log("Token refresh failed:", refreshError);
              setAccessToken(() => null);
              return Promise.reject(refreshError);
            });
          return originalResult;
        }

        return Promise.reject(error);
      }
    );
  }, [setAccessToken]);

  const isAuthenticated = useCallback(() => {
    return accessToken !== null && accessToken !== undefined;
  }, [accessToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsAuthenticating(() => true);
      await axios
        .post(`${config.AUTH_BASE_URL}/login`, { email, password })
        .then((res) => {
          setAccessToken(() => res.data.accessToken);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsAuthenticating(() => false);
        });
    },
    [setAccessToken]
  );

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated, isAuthenticating, login }}>
      {children}
    </AuthContext.Provider>
  );
}
