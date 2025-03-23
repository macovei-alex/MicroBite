using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace AuthServer.Service;

public class JwtService
{
	public static readonly TimeSpan DefaultAccessTokenExpirationDelay = TimeSpan.FromMinutes(1);
	public static readonly TimeSpan DefaultRefreshTokenExpirationDelay = TimeSpan.FromMinutes(5);

	private readonly SigningCredentials _signingCredentials;
	private readonly JwtSecurityTokenHandler _jwtHandler;

	private readonly string _issuer;
	private readonly string _audience;

	public JwtService(IConfiguration config)
	{
		Debug.Assert(!string.IsNullOrEmpty(config["JwtSettings:Issuer"]));
		Debug.Assert(!string.IsNullOrEmpty(config["JwtSettings:Audience"]));
		Debug.Assert(!string.IsNullOrEmpty(config["JwtSettings:PrivateKeyPath"]));
		Debug.Assert(File.Exists(config["JwtSettings:PrivateKeyPath"]));

		var rsa = RSA.Create();
		rsa.ImportFromPem(File.ReadAllText(config["JwtSettings:PrivateKeyPath"]!));
		_signingCredentials = new SigningCredentials(new RsaSecurityKey(rsa), SecurityAlgorithms.RsaSha256);
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
			SigningCredentials = _signingCredentials
		};

		var token = _jwtHandler.CreateToken(tokenDescriptor);
		return _jwtHandler.WriteToken(token);
	}
}
