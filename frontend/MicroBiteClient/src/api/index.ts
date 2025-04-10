import axios from "axios";

export const config = Object.freeze({
  AUTH_BASE_URL: import.meta.env.VITE_AUTH_BASE_URL,
  RES_BASE_URL: import.meta.env.VITE_RES_BASE_URL,
  CLIENT_ID: "MicroBiteClient",
  NON_REFRESHING_ROUTES: ["api/auth/refresh"],
});

export const authApi = axios.create({
  baseURL: config.AUTH_BASE_URL,
  withCredentials: false,
});

export const resApi = axios.create({
  baseURL: config.RES_BASE_URL,
  withCredentials: false,
});
