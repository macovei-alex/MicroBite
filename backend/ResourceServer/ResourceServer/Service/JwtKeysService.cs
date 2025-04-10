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

	public async Task<SecurityKey> GetSecurityKeyAsync(string keyId, string algorithm)
	{
		var jwtKeys = await GetSecurityKeysAsync();
		var securityKey = jwtKeys.FirstOrDefault(jwtKey => jwtKey.KeyId == keyId)
			?? throw new KeyNotFoundException(keyId);

		if (!securityKey.IsSupportedAlgorithm(algorithm))
		{
			throw new NotImplementedException($"The key with id ( {keyId} ) does not support the ( {algorithm} ) algorithm");
		}

		return securityKey;
	}

	private async Task<List<SecurityKey>> GetSecurityKeysAsync()
	{
		if (!_cache.TryGetValue("jwtKeys", out List<SecurityKey>? jwtKeys))
		{
			var jwks = await FetchJwksAsync();
			jwtKeys = jwks.Select(jwks => CreateKey(jwks.Kid, jwks.N, jwks.E)).ToList();
			_cache.Set("jwtKeys", jwtKeys, TimeSpan.FromMinutes(10));
		}
		return jwtKeys!;
	}

	private async Task<List<JwksDto>> FetchJwksAsync()
	{
		var handler = new HttpClientHandler
		{
			ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
		};
		using var httpClient = new HttpClient(handler);
		var jwkResponse = await httpClient.GetStringAsync(_jwkUrl);
		return JsonSerializer.Deserialize<JwksEndpointPayloadDto>(jwkResponse)!.Keys;
	}

	private static SecurityKey CreateKey(string kid, string n, string e)
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
