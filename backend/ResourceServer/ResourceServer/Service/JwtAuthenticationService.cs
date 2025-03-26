using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ResourceServer.Data.Security;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
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
	private readonly string[] _audiences = config.GetSection("JwtSettings:Audiences").Get<string[]>()!;
	private readonly JwtSecurityTokenHandler _jwtHandler = new()
	{
		MapInboundClaims = false,
	};


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
			var principal = ExtractClaims(token, securityKey);

			var identity = (principal.Identity as ClaimsIdentity)!;
			var jwtUser = JwtUser.CreateFromIdentity(identity);

			identity.AddClaim(new Claim(nameof(JwtUser), JsonSerializer.Serialize(jwtUser)));
			identity.AddClaim(new Claim(ClaimTypes.Role, jwtUser.Role));

			Context.User = principal;

			return AuthenticateResult.Success(new AuthenticationTicket(principal, "Jwt"));
		}
		catch (Exception ex)
		{
			return AuthenticateResult.Fail(ex.Message);
		}
	}

	private ClaimsPrincipal ExtractClaims(string token, SecurityKey key)
	{
		var principal = _jwtHandler.ValidateToken(token, new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidIssuer = _issuer,
			ValidateAudience = true,
			ValidAudiences = _audiences,
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = key,
			ValidateLifetime = true
		}, out _);
		return principal!;
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
