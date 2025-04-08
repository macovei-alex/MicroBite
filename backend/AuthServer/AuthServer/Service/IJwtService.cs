using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace AuthServer.Service;

public interface IJwtService
{
    string[] Audiences { get; init; }
    SigningCredentials SigningCredentials { get; init; }
    SecurityKey EncryptKey { get; init; }
    SecurityKey DecryptKey { get; init; }
    string CreateToken(Guid accountId, string role, string audience, TimeSpan expirationDelay);
    ClaimsPrincipal ExtractClaims(string token);
    bool TryVerifyAppClaims(ClaimsPrincipal claimsPrincipal, out string? failureMessage);
}