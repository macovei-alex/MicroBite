import { ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { authApi, resApi, config } from "../../api";
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { AuthContext } from "../types/AuthContext";
import { JwtClaims } from "../types/JwtClaims";

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null | undefined>(undefined);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const jwtClaims = useMemo<JwtClaims | null>(() => {
    if (!accessToken) {
      return null;
    }
    try {
      const payload = accessToken.split(".").slice(0, 2)[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error("Invalid JWT format:", accessToken, error);
      return null;
    }
  }, [accessToken]);

  const isAuthenticated = useCallback(() => {
    return accessToken !== null && accessToken !== undefined;
  }, [accessToken]);

  const tryRefreshAccessToken = useCallback(async () => {
    try {
      const response = await authApi.post("/auth/refresh", {}, { withCredentials: true });
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
    function accessTokenInterceptor(config: InternalAxiosRequestConfig) {
      config.headers.Authorization = accessToken
        ? `Bearer ${accessToken}`
        : config.headers.Authorization;
      return config;
    }

    const authInterceptorId = authApi.interceptors.request.use(accessTokenInterceptor);
    const resInterceptorId = resApi.interceptors.request.use(accessTokenInterceptor);

    return () => {
      authApi.interceptors.request.eject(authInterceptorId);
      resApi.interceptors.request.eject(resInterceptorId);
    };
  }, [accessToken]);

  useLayoutEffect(() => {
    function responseInterceptorFactory(api: AxiosInstance) {
      return async (error: AxiosError) => {
        const fullUrl = (error.config?.baseURL ?? "") + (error.config?.url ?? "");
        if (!error.config || fullUrl.includes(config.NON_REFRESHING_ROUTES[0])) {
          return Promise.reject(error);
        }
        const originalRequest = error.config;
        if (
          error.response?.status === axios.HttpStatusCode.Unauthorized &&
          !(originalRequest as any)._retry
        ) {
          (originalRequest as any)._retry = true;
          await tryRefreshAccessToken();
          if (isAuthenticated()) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      };
    }

    const authResponseInterceptorId = authApi.interceptors.response.use(
      (response) => response,
      responseInterceptorFactory(authApi)
    );
    const resResponseInterceptorId = resApi.interceptors.response.use(
      (response) => response,
      responseInterceptorFactory(resApi)
    );

    return () => {
      authApi.interceptors.response.eject(authResponseInterceptorId);
      resApi.interceptors.response.eject(resResponseInterceptorId);
    };
  }, [accessToken, setAccessToken, isAuthenticated, tryRefreshAccessToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsAuthenticating(true);
      try {
        const response = await authApi.post(
          "/auth/login",
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
    <AuthContext.Provider
      value={{ accessToken, jwtClaims, isAuthenticated, isAuthenticating, login }}
    >
      {children}
    </AuthContext.Provider>
  );
}
