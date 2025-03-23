using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace AuthServer.Service;

public class JwtService
{
	public static readonly TimeSpan DefaultAccessTokenExpirationDelay = TimeSpan.FromMinutes(1);
	public static readonly TimeSpan DefaultRefreshTokenExpirationDelay = TimeSpan.FromMinutes(15);

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
		_audience = config["JwtSettings:Audience"]!;
	}

	public string CreateToken(Guid userId, string role, TimeSpan expirationDelay)
	{
		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Subject = new ClaimsIdentity(
			[
				new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
				new Claim(ClaimTypes.Role, role),
			]),
			Expires = DateTime.UtcNow + expirationDelay,
			Issuer = _issuer,
			Audience = _audience,
			SigningCredentials = SigningCredentials
		};

		var token = _jwtHandler.CreateToken(tokenDescriptor);
		return _jwtHandler.WriteToken(token);
	}
}
