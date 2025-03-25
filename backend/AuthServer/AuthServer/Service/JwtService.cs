using AuthServer.Data;
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
	private readonly string _audience;

	public SigningCredentials SigningCredentials { get; init; }
	public SecurityKey SecurityKey { get; init; }

	public JwtService(IConfiguration config)
	{
		var rsa = RSA.Create();
		rsa.ImportFromPem(File.ReadAllText(config["JwtSettings:PrivateKeyPath"]!));

		SecurityKey = new RsaSecurityKey(rsa)
		{
			KeyId = config["JwtSettings:KeyId"]!
		};
		SigningCredentials = new SigningCredentials(SecurityKey, SecurityAlgorithms.RsaSha256);
		_jwtHandler = new JwtSecurityTokenHandler();

		_issuer = config["JwtSettings:Issuer"]!;
		_audience = config.GetSection("JwtSettings:Audiences").Get<string[]>()![0];
	}

	public string CreateToken(Guid accountId, string role, TimeSpan expirationDelay)
	{
		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Subject = new ClaimsIdentity(
			[
				new Claim(JwtAppValidClaims.Subject, accountId.ToString()),
				new Claim(JwtAppValidClaims.Role, role),
			]),
			Expires = DateTime.UtcNow + expirationDelay,
			Issuer = _issuer,
			Audience = _audience,
			SigningCredentials = SigningCredentials,
			IssuedAt = DateTime.UtcNow,
			NotBefore = DateTime.UtcNow,
		};

		var token = _jwtHandler.CreateToken(tokenDescriptor);
		return _jwtHandler.WriteToken(token);
	}
}
