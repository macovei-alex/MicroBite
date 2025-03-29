import axios from "axios";

const AUTH_BASE_URL = "http://localhost:5095/api/auth";
const RES_BASE_URL = "http://localhost:5247/api";
const CLIENT_ID = "MicroBiteClient";
const NON_REFRESHING_ROUTES = ["api/auth/refresh"];

export const config = Object.freeze({
  AUTH_BASE_URL,
  RES_BASE_URL,
  CLIENT_ID,
  NON_REFRESHING_ROUTES,
});

export const authApi = axios.create({
  baseURL: config.AUTH_BASE_URL,
  withCredentials: false,
});

export const resApi = axios.create({
  baseURL: config.RES_BASE_URL,
  withCredentials: false,
});
