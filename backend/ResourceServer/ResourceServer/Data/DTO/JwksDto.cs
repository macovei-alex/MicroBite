using System.Text.Json;
using System.Text.Json.Nodes;

namespace ResourceServer.Data.DTO;

public class JwksDto
{
	public required string Kty { get; init; }
	public required string Use { get; init; }
	public required string Kid { get; init; }
	public required string Alg { get; init; }
	public required string N { get; init; }
	public required string E { get; init; }

	public static JwksDto FromJson(JsonElement json)
	{
		return new JwksDto
		{
			Kty = json.TryGetProperty("kty", out var kty)
				? kty!.ToString()
				: throw new ArgumentException("( kty ) property not defined on jwks json object received"),
			Use = json.TryGetProperty("use", out var use)
				? use!.ToString()
				: throw new ArgumentException("( use ) property not defined on jwks json object received"),
			Kid = json.TryGetProperty("kid", out var kid)
				? kid!.ToString()
				: throw new ArgumentException("( kid ) property not defined on jwks json object received"),
			Alg = json.TryGetProperty("alg", out var alg)
				? alg!.ToString()
				: throw new ArgumentException("( alg ) property not defined on jwks jsonobject received"),
			N = json.TryGetProperty("n", out var n)
				? n!.ToString()
				: throw new ArgumentException("( n ) property not defined on jwks json object received"),
			E = json.TryGetProperty("e", out var e)
				? e!.ToString()
				: throw new ArgumentException("( e ) property not defined on jwks object received"),
		};
	}
}
