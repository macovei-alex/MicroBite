using Microsoft.IdentityModel.Tokens;

namespace AuthServer.Data.Dto;

public class JwksDto
{
	public required string Kty { get; init; }
	public required string Use { get; init; }
	public required string Kid { get; init; }
	public required string N { get; init; }
	public required string E { get; init; }

	public static JwksDto FromRsaSecurityKey(RsaSecurityKey rsaKey)
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
		if (rsaKey.KeyId == null)
		{
			throw new ArgumentException("Key id was null");
		}

		return new JwksDto
		{
			Kty = "RSA",
			Use = "sig",
			Kid = rsaKey.KeyId,
			N = Convert.ToBase64String(keyParams.Modulus!),
			E = Convert.ToBase64String(keyParams.Exponent!)
		};
	}
}
