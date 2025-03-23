using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;

namespace ResourceServer.Service;

// TODO: See how to modernize this a bit. It works but it's deprecated
public class JwtAuthenticationService(
	JwtKeysService jwtKeysService,
	IConfiguration config,
	IOptionsMonitor<AuthenticationSchemeOptions> options,
	ILoggerFactory logger,
	UrlEncoder encoder,
	ISystemClock clock
) : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder, clock)
{
	private readonly JwtKeysService _jwtKeysService = jwtKeysService;
	private readonly string _issuer = config["JwtSettings:Issuer"]!;
	private readonly string _audience = config["JwtSettings:Audience"]!;


	private class JwtDecodedMinimalData
	{
		public required string KeyId { get; set; }
		public required string Algorithm { get; set; }
	}


	protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
	{
		var authorizationHeader = Request.Headers.Authorization.FirstOrDefault();
		if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
		{
			return AuthenticateResult.Fail("Missing or invalid authorization header");
		}

		var token = authorizationHeader["Bearer ".Length..].Trim();
		try
		{
			var decodedData = DecodeMinimalData(token);
			var securityKey = await _jwtKeysService.GetSecurityKeyAsync(decodedData.KeyId, decodedData.Algorithm);
			var (securityToken, principal) = ValidateToken(token, securityKey);

			Context.Items["SecurityToken"] = securityToken;
			Context.User = principal;

			return AuthenticateResult.Success(new AuthenticationTicket(principal, "Jwt"));
		}
		catch (Exception ex)
		{
			return AuthenticateResult.Fail(ex.Message);
		}
	}

	private (SecurityToken, ClaimsPrincipal) ValidateToken(string token, SecurityKey key)
	{
		var tokenHandler = new JwtSecurityTokenHandler();
		var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidIssuer = _issuer,
			ValidateAudience = true,
			ValidAudience = _audience,
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = key,
			ValidateLifetime = true
		}, out SecurityToken securityToken);
		return (securityToken, principal!);
	}

	private static JwtDecodedMinimalData DecodeMinimalData(string jwt)
	{
		var parts = jwt.Split('.');
		if (parts.Length != 3)
		{
			throw new ArgumentException("JWT format is invalid", nameof(jwt));
		}

		var headerJson = Base64UrlDecode(parts[0]);
		using var jsonDoc = JsonDocument.Parse(headerJson);
		if (jsonDoc.RootElement.TryGetProperty("kid", out var kid)
			&& jsonDoc.RootElement.TryGetProperty("alg", out var alg))
		{
			return new JwtDecodedMinimalData
			{
				KeyId = kid.GetString()!,
				Algorithm = alg.GetString()!
			};
		}
		else
		{
			throw new Exception("JWT does not contain either a 'kid' or an 'alg' property");
		}
	}

	private static string Base64UrlDecode(string input)
	{
		var base64 = input.Replace('-', '+').Replace('_', '/');
		// Might be needed
		/*
		switch (base64.Length % 4)
		{
			case 2: base64 += "=="; break;
			case 3: base64 += "="; break;
		}
		*/
		var decodedBytes = Convert.FromBase64String(base64);
		return Encoding.UTF8.GetString(decodedBytes);
	}
}
