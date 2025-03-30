import { Role } from "./Role";

export type JwtClaims = {
  sub: string;
  role: Role;
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
};
