using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;
using ResourceServer.Data.DTO;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace ResourceServer.Service;

public class JwtKeysService(IMemoryCache cache, IConfiguration config)
{
	private readonly IMemoryCache _cache = cache;
	private readonly string _jwkUrl = config["JwtSettings:JwksUrl"]!;

	public async Task<SecurityKey> GetSecurityKeyAsync(string kid)
	{
		var jwtKeys = await GetSecurityKeysAsync();
		var securityKey = jwtKeys.FirstOrDefault(jwtKey => jwtKey.KeyId == kid)
			?? throw new KeyNotFoundException(kid);

		if (!securityKey.IsSupportedAlgorithm("RS256"))
		{
			throw new NotImplementedException($"The key with id ( {kid} ) does not support the algorithm RS256");
		}

		return securityKey;
	}

	private async Task<IEnumerable<SecurityKey>> GetSecurityKeysAsync()
	{
		if (!_cache.TryGetValue("jwtKeys", out IEnumerable<SecurityKey>? jwtKeys))
		{
			var jwks = await FetchJwksAsync();
			jwtKeys = jwks.Select(jwks => CreateKey(jwks.Kid, jwks.N, jwks.E));
			_cache.Set("jwtKeys", jwtKeys, TimeSpan.FromMinutes(1));
		}
		return jwtKeys!;
	}

	private async Task<IEnumerable<JwksDto>> FetchJwksAsync()
	{
		using var httpClient = new HttpClient();
		var jwkResponse = await httpClient.GetStringAsync(_jwkUrl);
		var jwksDocument = JsonDocument.Parse(jwkResponse);
		return jwksDocument.RootElement.GetProperty("keys").EnumerateArray()
			.Select(jwksJson => JwksDto.FromJson(jwksJson));
	}

	private RsaSecurityKey CreateKey(string kid, string n, string e)
	{
		var rsa = RSA.Create();
		rsa.ImportParameters(new RSAParameters
		{
			Modulus = Convert.FromBase64String(n),
			Exponent = Convert.FromBase64String(e),
		});

		var rsaKey = new RsaSecurityKey(rsa)
		{
			KeyId = kid
		};

		return rsaKey;
	}
}
