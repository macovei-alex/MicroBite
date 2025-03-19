import axios from "axios";
import { config } from "./config";

export async function login(email: string, password: string) {
  return (await axios.post(`${config.AUTH_BASE_URL}`, { email, password })).data;
}
