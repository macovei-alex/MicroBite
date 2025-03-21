import axios from "axios";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { config } from "../api/config";
import { api } from "../api";
import { useLocation, useNavigate } from "react-router-dom";

type AuthContextType = {
  accessToken: string | null | undefined;
  authenticate: (token: string) => void;
  isAuthenticated: () => boolean;
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
  const navigate = useNavigate();
  const location = useLocation();

  const authenticate = useCallback(
    (token: string) => {
      setAccessToken(token);
      const origin = location.state?.from;
      if (origin) {
        navigate(origin);
      }
    },
    [navigate, location]
  );

  // TODO: Implement the actual authentication and interceptors mechanism

  /*
  useEffect(() => {
    axios
      .get(`${config.AUTH_BASE_URL}/refresh`, { withCredentials: true })
      .then((res) => {
        if (res.status === axios.HttpStatusCode.Ok) {
          console.log("Access token received: ", res.data.accessToken);
          setAccessToken(res.data.accessToken);
        } else {
          console.error("Access token refresh failed: ", res);
          setAccessToken(null);
        }
      })
      .catch((error) => {
        console.error("Access token refresh failed: ", error);
        setAccessToken(null);
      });
  }, []);

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

        // If unauthorized (401) and not a retry, attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // DO NOT USE LOCAL STORAGE
            const refreshToken = localStorage.getItem("refresh_token"); // Get refresh token
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            // Call API to refresh token
            const { data } = await axios.post(`${config.AUTH_BASE_URL}/refresh`, {
              refresh_token: refreshToken,
            });

            // Store new token
            // DO NOT USE LOCAL STORAGE
            localStorage.setItem("access_token", data.access_token);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
            return api(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            localStorage.removeItem("access_token"); // Clear tokens if refresh fails
            localStorage.removeItem("refresh_token");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }, [accessToken]);
  */

  const isAuthenticated = useCallback(() => {
    return accessToken !== null && accessToken !== undefined;
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, authenticate, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
