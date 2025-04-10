namespace AuthServer.UnitTests.Services;

[TestClass]
public class AuthServiceTestsWithNSubstitute
{
    private IAccountRepository _mockAccountRepository;
    private IJwtService _mockJwtService;
    private HttpResponse _mockHttpResponse;
    private IResponseCookies _mockCookies;

    [TestInitialize]
    public void TestInitialize()
    {
        _mockAccountRepository = Substitute.For<IAccountRepository>();
        _mockJwtService = Substitute.For<IJwtService>();
        _mockHttpResponse = Substitute.For<HttpResponse>();
        _mockCookies = Substitute.For<IResponseCookies>();
    }

    [TestMethod]
    public async Task Login_ValidCredentials_ReturnsTokenPairAndSetsRefreshTokenCookie_FullAccount()
    {
        var loginPayload = new LoginPayloadDto
        {
            Email = "test@example.com",
            Password = "validPassword",
            ClientId = "testClient"
        };
        var mockAccount = CreateFullAccount();
        var expectedAccessToken = "mockAccessToken";
        var expectedRefreshToken = "newMockRefreshToken";
        _mockAccountRepository.GetByEmailAsync(loginPayload.Email).Returns(Task.FromResult(mockAccount));
        await _mockAccountRepository.UpdateAsync(Arg.Any<Account>());
        _mockJwtService.CreateToken(mockAccount.Id, mockAccount.Role.Name, loginPayload.ClientId, JwtService.DefaultAccessTokenExpirationDelay)
            .Returns(expectedAccessToken);
        _mockJwtService.CreateToken(mockAccount.Id, mockAccount.Role.Name, loginPayload.ClientId, JwtService.DefaultRefreshTokenExpirationDelay)
            .Returns(expectedRefreshToken);
        _mockHttpResponse.Cookies.Returns(_mockCookies);
        var authService = new AuthService(_mockAccountRepository, _mockJwtService);

        var result = authService.Login(_mockHttpResponse, loginPayload);

        Assert.IsNotNull(result);
        Assert.AreEqual(expectedAccessToken, result.AccessToken);
        Assert.AreEqual(expectedRefreshToken, result.RefreshToken);

        _mockCookies.Received(1).Append(
            "refreshToken",
            expectedRefreshToken,
            Arg.Is<CookieOptions>(o => o.HttpOnly && !o.Secure && o.SameSite == SameSiteMode.Strict));

        await _mockAccountRepository.Received(1).UpdateAsync(Arg.Is<Account>(a =>
            a.Id == mockAccount.Id &&
            a.RefreshToken == expectedRefreshToken));
    }

    [TestMethod]
    public async Task Login_InvalidPassword_ThrowsArgumentException_FullAccountAsync()
    {
        var loginPayload = new LoginPayloadDto
        {
            Email = "test@example.com",
            Password = "invalidPassword",
            ClientId = "testClient"
        };
        var mockAccount = CreateFullAccount();
        _mockAccountRepository.GetByEmailAsync(loginPayload.Email).Returns(Task.FromResult(mockAccount));

        var authService = new AuthService(_mockAccountRepository, _mockJwtService);

        Assert.ThrowsException<ArgumentException>(() => authService.Login(_mockHttpResponse, loginPayload));
        await _mockAccountRepository.DidNotReceive().UpdateAsync(Arg.Any<Account>());
        _mockHttpResponse.Cookies.DidNotReceive().Append(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CookieOptions>());
        _mockJwtService.DidNotReceive().CreateToken(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<TimeSpan>());
    }

    private static Account CreateFullAccount() => new Account
    {
        Id = Guid.NewGuid(),
        FirstName = "Test",
        LastName = "User",
        Email = "test@example.com",
        PhoneNumber = "123-456-7890",
        PasswordHash = Argon2.Hash("validPassword"),
        Role = new Role { Id = 1, Name = "User" },
        RefreshToken = "oldRefreshToken"
    };
}