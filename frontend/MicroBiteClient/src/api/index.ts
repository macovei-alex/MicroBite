import axios from "axios";

const AUTH_BASE_URL = "http://localhost:5095/api/auth";
const RES_BASE_URL = "";
const CLIENT_ID = "MicroBiteClient";

export const config = Object.freeze({ AUTH_BASE_URL, RES_BASE_URL, CLIENT_ID });

export const api = axios.create({
  baseURL: config.RES_BASE_URL,
  withCredentials: false,
});
