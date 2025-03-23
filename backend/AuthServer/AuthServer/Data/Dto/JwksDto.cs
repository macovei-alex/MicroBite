using Microsoft.IdentityModel.Tokens;

namespace AuthServer.Data.Dto;

public class JwksDto
{
	public required string Kty { get; init; }
	public required string Use { get; init; }
	public required string Kid { get; init; }
	public required string Alg { get; init; }
	public required string N { get; init; }
	public required string E { get; init; }

	public static JwksDto FromSecurityKey(SecurityKey key, string algorithm)
	{
		if (key.KeyId == null)
		{
			throw new ArgumentException("Key id was null");
		}

		return key switch
		{
			RsaSecurityKey rsaKey => FromRsaSecurityKey(rsaKey, algorithm),
			_ => throw new NotImplementedException("The provided security key has not been implemented yet")
		};
	}

	private static JwksDto FromRsaSecurityKey(RsaSecurityKey rsaKey, string algorithm)
	{
		var keyParams = rsaKey.Rsa.ExportParameters(false);
		if (keyParams.Modulus == null)
		{
			throw new ArgumentException("Key modulus was null");
		}
		if (keyParams.Exponent == null)
		{
			throw new ArgumentException("Key exponent was null");
		}

		return new JwksDto
		{
			Kty = "RSA",
			Use = "sig",
			Kid = rsaKey.KeyId,
			Alg = algorithm,
			N = Convert.ToBase64String(keyParams.Modulus!),
			E = Convert.ToBase64String(keyParams.Exponent!)
		};
	}
}
