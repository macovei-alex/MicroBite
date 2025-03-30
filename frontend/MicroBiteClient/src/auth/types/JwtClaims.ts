export type JwtClaims = {
  sub: string;
  role: string;
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
};
