using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json;

namespace ResourceServer.Service;

public class JwtValidatorService(JwtKeysService jwksService)
{
	private readonly JwtKeysService _jwksService = jwksService;

	public bool Validate(string token)
	{
		var kid = GetKidFromToken(token);
		var securityKey = _jwksService.GetSecurityKeyAsync(kid).Result;

		var tokenHandler = new JwtSecurityTokenHandler();
		try
		{
			var validationParameters = new TokenValidationParameters
			{
				IssuerSigningKey = securityKey,
				ValidateIssuer = false,
				ValidateAudience = false,
				ValidateLifetime = true,
			};

			tokenHandler.ValidateToken(token, validationParameters, out _);
			return true;
		}
		catch (Exception ex)
		{
			Console.WriteLine(ex.Message);
			return false;
		}
	}

	private string GetKidFromToken(string token)
	{
		var segments = token.Split('.');
		if (segments.Length < 2)
		{
			throw new ArgumentException("Invalid JWT token");
		}

		var header = Base64UrlDecode(segments[0]);
		using var doc = JsonDocument.Parse(header);
		return doc.RootElement.GetProperty("kid").GetString();
	}

	public string Base64UrlDecode(string base64Url)
	{
		base64Url = base64Url
			.Replace('-', '+')
			.Replace('_', '/');
		return Encoding.UTF8.GetString(Convert.FromBase64String(base64Url));
	}
}
