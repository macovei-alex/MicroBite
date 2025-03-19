import * as loginFunctions from "./login";
import { config } from "./config";

export const api = {
  config,
  ...loginFunctions,
};
