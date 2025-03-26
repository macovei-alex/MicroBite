using AuthServer.Data;
using System.Security.Claims;

namespace AuthServer.Utils;

public static class ClaimsPrincipalExtensionMethods
{
	public static string? GetSubject(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtAppValidClaims.Subject)?.Value;
	}

	public static string? GetRole(this ClaimsPrincipal claimsPrincipal)
	{
		return claimsPrincipal.FindFirst(JwtAppValidClaims.Role)?.Value;
	}
}
