namespace AuthServer.Data;

public static class JwtAppValidClaims
{
	public const string Subject = "sub";
	public const string Role = "role";
	public const string NotBefore = "nbf";
	public const string ExpiresAt = "exp";
	public const string IssuedAt = "iat";
	public const string Issuer = "iss";
	public const string Audience = "aud";
}
