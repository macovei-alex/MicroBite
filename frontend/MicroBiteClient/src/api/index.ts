import axios from "axios";

const AUTH_BASE_URL = "http://localhost:5095/api/auth";
const API_BASE_URL = "http://localhost:5095/api";
const RES_BASE_URL = "";
const CLIENT_ID = "MicroBiteClient";

export const config = Object.freeze({ AUTH_BASE_URL, RES_BASE_URL, CLIENT_ID });

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});
