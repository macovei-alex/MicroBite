using AuthServer.Data.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text.Json;

namespace AuthServer.Service;

public class JwtClaimsTransformer : IClaimsTransformation
{
	public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
	{
		if (principal.Identity is not ClaimsIdentity identity || !identity.IsAuthenticated)
			return Task.FromResult(principal);

		try
		{
			var jwtUser = JwtUser.CreateFromIdentity(identity);

			identity.AddClaim(new Claim(nameof(JwtUser), JsonSerializer.Serialize(jwtUser)));
			identity.AddClaim(new Claim(ClaimTypes.Role, jwtUser.Role));

			return Task.FromResult(principal);
		}
		catch
		{
			throw new SecurityTokenException("Invalid authentication token");
		}
	}
}