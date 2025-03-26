using AuthServer.Data.Security;
using AuthServer.Utils;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace AuthServer.Service;

public class JwtService
{
	public static readonly TimeSpan DefaultAccessTokenExpirationDelay = TimeSpan.FromMinutes(10);
	public static readonly TimeSpan DefaultRefreshTokenExpirationDelay = TimeSpan.FromMinutes(30);

	private readonly JwtSecurityTokenHandler _jwtHandler;

	private readonly string _issuer;
	public string[] Audiences { get; init; }
	public SigningCredentials SigningCredentials { get; init; }
	public SecurityKey EncryptKey { get; init; }
	public SecurityKey DecryptKey { get; init; }

	public JwtService(IConfiguration config)
	{
		var encryptRsa = RSA.Create();
		encryptRsa.ImportFromPem(File.ReadAllText(config["JwtSettings:PrivateKeyPath"]!));
		EncryptKey = new RsaSecurityKey(encryptRsa)
		{
			KeyId = config["JwtSettings:KeyId"]!
		};

		var decryptRsa = RSA.Create();
		decryptRsa.ImportFromPem(File.ReadAllText(config["JwtSettings:PublicKeyPath"]!));
		DecryptKey = new RsaSecurityKey(decryptRsa)
		{
			KeyId = config["JwtSettings:KeyId"]!
		};

		SigningCredentials = new SigningCredentials(EncryptKey, SecurityAlgorithms.RsaSha256);
		_jwtHandler = new()
		{
			MapInboundClaims = false,
		};

		_issuer = config["JwtSettings:Issuer"]!;
		Audiences = config.GetSection("JwtSettings:Audiences").Get<string[]>()!;
	}

	public string CreateToken(Guid accountId, string role, string audience, TimeSpan expirationDelay)
	{
		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Subject = new ClaimsIdentity(
			[
				new Claim(JwtUser.ClaimNames.Subject, accountId.ToString()),
				new Claim(JwtUser.ClaimNames.Role, role),
			]),
			Expires = DateTime.UtcNow + expirationDelay,
			Issuer = _issuer,
			Audience = audience,
			SigningCredentials = SigningCredentials,
			IssuedAt = DateTime.UtcNow,
			NotBefore = DateTime.UtcNow,
		};

		var token = _jwtHandler.CreateToken(tokenDescriptor);
		return _jwtHandler.WriteToken(token);
	}

	public ClaimsPrincipal ExtractClaims(string token)
	{
		var principal = _jwtHandler.ValidateToken(token, new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidIssuer = _issuer,
			ValidateAudience = true,
			ValidAudiences = Audiences,
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = DecryptKey,
			ValidateLifetime = true
		}, out _);
		return principal;
	}

	public bool TryVerifyAppClaims(ClaimsPrincipal claimsPrincipal, out string? failureMessage)
	{
		failureMessage =
		(
			(string.IsNullOrEmpty(claimsPrincipal.Subject())
				? "Subject claim missing; " : string.Empty) +
			(claimsPrincipal.Subject() != null && !Guid.TryParse(claimsPrincipal.Subject(), out _)
				? "Subject claim is not a valid GUID; " : string.Empty) +
			(string.IsNullOrEmpty(claimsPrincipal.Role())
				? "Role claim missing; " : string.Empty)
		);

		if (failureMessage != string.Empty)
		{
			failureMessage = failureMessage[..^2];
			return false;
		}

		failureMessage = null;
		return true;
	}
}
