using AuthServer.Data.Security;
using System.Security.Claims;

namespace AuthServer.Utils;

public static class ClaimsPrincipalExtensionMethods
{
	public static string Subject(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtUser.ClaimNames.Subject)!.Value;
	}

	public static string Role(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtUser.ClaimNames.Role)!.Value;
	}

	public static string NotBefore(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtUser.ClaimNames.NotBefore)!.Value;
	}

	public static string ExpiresAt(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtUser.ClaimNames.ExpiresAt)!.Value;
	}

	public static string IssuedAt(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtUser.ClaimNames.IssuedAt)!.Value;
	}

	public static string Issuer(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtUser.ClaimNames.Issuer)!.Value;
	}

	public static string Audience(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtUser.ClaimNames.Audience)!.Value;
	}
}
