namespace AuthServer.UnitTests.Services;

[TestClass]
public class JwtClaimsTransformerTests
{
    private JwtClaimsTransformer _claimsTransformer;

    [TestInitialize]
    public void TestInitialize()
    {
        _claimsTransformer = new JwtClaimsTransformer();
    }

    [TestMethod]
    public async Task TransformAsync_UnauthenticatedPrincipal_ReturnsOriginalPrincipal()
    {
        var principal = new ClaimsPrincipal(new ClaimsIdentity());
        var transformedPrincipal = await _claimsTransformer.TransformAsync(principal);
        Assert.AreEqual(principal, transformedPrincipal);
    }

    [TestMethod]
    public async Task TransformAsync_AuthenticatedPrincipalMissingRequiredClaims_ThrowsSecurityTokenException()
    {
        var claims = new List<Claim>
        {
            new(JwtUser.ClaimNames.Subject, Guid.NewGuid().ToString()),
            new(JwtUser.ClaimNames.NotBefore, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
            new(JwtUser.ClaimNames.ExpiresAt, DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds().ToString()),
            new(JwtUser.ClaimNames.IssuedAt, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
            new(JwtUser.ClaimNames.Issuer, "testIssuer"),
            new(JwtUser.ClaimNames.Audience, "testAudience")
        };
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);

        await Assert.ThrowsExceptionAsync<SecurityTokenException>(async () =>
            await _claimsTransformer.TransformAsync(principal));
    }

    [TestMethod]
    public async Task TransformAsync_AuthenticatedPrincipalWithInvalidDateFormat_ThrowsSecurityTokenException()
    {
        var claims = new List<Claim>
        {
            new(JwtUser.ClaimNames.Subject, Guid.NewGuid().ToString()),
            new(JwtUser.ClaimNames.Role, "User"),
            new(JwtUser.ClaimNames.NotBefore, "invalid date"),
            new(JwtUser.ClaimNames.ExpiresAt, DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds().ToString()),
            new(JwtUser.ClaimNames.IssuedAt, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
            new(JwtUser.ClaimNames.Issuer, "testIssuer"),
            new(JwtUser.ClaimNames.Audience, "testAudience")
        };
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);

        await Assert.ThrowsExceptionAsync<SecurityTokenException>(async () =>
            await _claimsTransformer.TransformAsync(principal));
    }
}