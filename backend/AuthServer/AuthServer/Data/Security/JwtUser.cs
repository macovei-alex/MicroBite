using System.Security.Claims;
using System.Text.Json;

namespace AuthServer.Data.Security;

public class JwtUser
{
	public static class ClaimNames
	{
		public const string Subject = "sub";
		public const string Role = "role";
		public const string NotBefore = "nbf";
		public const string ExpiresAt = "exp";
		public const string IssuedAt = "iat";
		public const string Issuer = "iss";
		public const string Audience = "aud";
	}

	public required Guid Id { get; set; }
	public required string Role { get; set; }
	public required DateTime NotBefore { get; set; }
	public required DateTime ExpiresAt { get; set; }
	public required DateTime IssuedAt { get; set; }
	public required string Issuer { get; set; }
	public required string Audience { get; set; }

	public static JwtUser CreateFromIdentity(ClaimsIdentity identity)
	{
		if (identity.FindFirst(ClaimNames.NotBefore) == null)
		{
			throw new InvalidOperationException($"Missing ( {ClaimNames.NotBefore} ) claims");
		}
		if (identity.FindFirst(ClaimNames.ExpiresAt) == null)
		{
			throw new InvalidOperationException($"Missing ( {ClaimNames.ExpiresAt} ) claimslaims");
		}
		if (identity.FindFirst(ClaimNames.IssuedAt) == null)
		{
			throw new InvalidOperationException($"Missing ( {ClaimNames.IssuedAt} ) claims");
		}

		return new JwtUser
		{
			Id = Guid.Parse(identity.FindFirst(ClaimNames.Subject)?.Value
					?? throw new InvalidOperationException($"Missing ( {ClaimNames.Subject} ) claim")),
			Role = identity.FindFirst(ClaimNames.Role)?.Value
					?? throw new InvalidOperationException($"Missing ( {ClaimNames.Role} ) claim"),
			NotBefore = DateTimeOffset.FromUnixTimeSeconds(long.Parse(identity.FindFirst(ClaimNames.NotBefore)!.Value)).UtcDateTime,
			ExpiresAt = DateTimeOffset.FromUnixTimeSeconds(long.Parse(identity.FindFirst(ClaimNames.ExpiresAt)!.Value)).UtcDateTime,
			IssuedAt = DateTimeOffset.FromUnixTimeSeconds(long.Parse(identity.FindFirst(ClaimNames.IssuedAt)!.Value)).UtcDateTime,
			Issuer = identity.FindFirst(ClaimNames.Issuer)?.Value
					?? throw new InvalidOperationException($"Missing ( {ClaimNames.Issuer} ) claim"),
			Audience = identity.FindFirst(ClaimNames.Audience)?.Value
					?? throw new InvalidOperationException($"Missing ( {ClaimNames.Audience} ) claim")
		};
	}

	public static JwtUser GetFromPrincipal(ClaimsPrincipal user)
	{
		return JsonSerializer.Deserialize<JwtUser>(user.FindFirst(nameof(JwtUser))!.Value)!;
	}
}
