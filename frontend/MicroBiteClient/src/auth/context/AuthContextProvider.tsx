import { ReactNode, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { api, config } from "../../api";
import axios from "axios";
import { AuthContext } from "./AuthContext";

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
      console.log("Access token refresh successfully");
      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.warn("Access token refresh failed: ", error);
      setAccessToken(null);
    }
  }, [setAccessToken]);

  useEffect(() => {
    (async function () {
      setIsAuthenticating(true);
      await tryRefreshAccessToken();
      setIsAuthenticating(false);
    })();
  }, [setIsAuthenticating, tryRefreshAccessToken]);

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
    const authResponseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === axios.HttpStatusCode.Unauthorized &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          await tryRefreshAccessToken();
          if (isAuthenticated()) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(authResponseInterceptor);
    };
  }, [accessToken, setAccessToken, isAuthenticated, tryRefreshAccessToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsAuthenticating(true);
      try {
        const response = await axios.post(
          `${config.AUTH_BASE_URL}/login`,
          { email, password, clientId: config.CLIENT_ID },
          { withCredentials: true }
        );
        setAccessToken(response.data.accessToken);
        return null;
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const message = error.response?.data;
          return typeof message === "string" ? message : "An unknown error occurred";
        }
        return "An unknown error occurred";
      } finally {
        setIsAuthenticating(false);
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
