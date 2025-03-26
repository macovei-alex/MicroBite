using AuthServer.Data;
using System.Security.Claims;

namespace AuthServer.Utils;

public static class ClaimsPrincipalExtensionMethods
{
	public static string Subject(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtAppValidClaims.Subject)!.Value;
	}

	public static string Role(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtAppValidClaims.Role)!.Value;
	}

	public static string NotBefore(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtAppValidClaims.NotBefore)!.Value;
	}

	public static string ExpiresAt(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtAppValidClaims.ExpiresAt)!.Value;
	}

	public static string IssuedAt(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtAppValidClaims.IssuedAt)!.Value;
	}

	public static string Issuer(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtAppValidClaims.Issuer)!.Value;
	}

	public static string Audience(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtAppValidClaims.Audience)!.Value;
	}
}
