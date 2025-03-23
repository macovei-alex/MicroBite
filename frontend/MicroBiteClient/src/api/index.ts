import axios from "axios";

const AUTH_BASE_URL = "http://localhost:5095/api/auth";
const RES_BASE_URL = "";

export const config = Object.freeze({ AUTH_BASE_URL, RES_BASE_URL });

export const api = axios.create({
  baseURL: config.RES_BASE_URL,
  withCredentials: false,
});
