using AuthServer.Data.Dto;
using AuthServer.Data.Models;
using AuthServer.Data.Repositories;
using AuthServer.Service;
using Isopoh.Cryptography.Argon2;
using Microsoft.AspNetCore.Http;
using NSubstitute;

namespace AuthServer.UnitTests.Services;

[TestClass]
public class AuthServiceTestsWithNSubstitute
{
    [TestMethod]
    public async Task Login_ValidCredentials_ReturnsTokenPairAndSetsRefreshTokenCookie_FullAccount()
    {
        var mockAccountRepository = Substitute.For<IAccountRepository>();
        var mockJwtService = Substitute.For<IJwtService>();
        var mockHttpResponse = Substitute.For<HttpResponse>();
        var mockCookies = Substitute.For<IResponseCookies>();
        var loginPayload = new LoginPayloadDto
        {
            Email = "test@example.com",
            Password = "validPassword",
            ClientId = "testClient"
        };
        var mockAccount = CreateFullAccount();
        var expectedAccessToken = "mockAccessToken";
        var expectedRefreshToken = "newMockRefreshToken";
        mockAccountRepository.GetByEmailAsync(loginPayload.Email).Returns(Task.FromResult(mockAccount));
        await mockAccountRepository.UpdateAsync(Arg.Any<Account>());
        mockJwtService.CreateToken(mockAccount.Id, mockAccount.Role.Name, loginPayload.ClientId, JwtService.DefaultAccessTokenExpirationDelay)
            .Returns(expectedAccessToken);
        mockJwtService.CreateToken(mockAccount.Id, mockAccount.Role.Name, loginPayload.ClientId, JwtService.DefaultRefreshTokenExpirationDelay)
            .Returns(expectedRefreshToken);
        mockHttpResponse.Cookies.Returns(mockCookies);
        var authService = new AuthService(mockAccountRepository, mockJwtService);

        var result = authService.Login(mockHttpResponse, loginPayload);

        Assert.IsNotNull(result);
        Assert.AreEqual(expectedAccessToken, result.AccessToken);
        Assert.AreEqual(expectedRefreshToken, result.RefreshToken);

        mockCookies.Received(1).Append(
            "refreshToken",
            expectedRefreshToken,
            Arg.Is<CookieOptions>(o => o.HttpOnly && !o.Secure && o.SameSite == SameSiteMode.Strict));

        await mockAccountRepository.Received(1).UpdateAsync(Arg.Is<Account>(a =>
            a.Id == mockAccount.Id &&
            a.RefreshToken == expectedRefreshToken));
    }

    [TestMethod]
    public async Task Login_InvalidPassword_ThrowsArgumentException_FullAccountAsync()
    {
        var mockAccountRepository = Substitute.For<IAccountRepository>();
        var mockJwtService = Substitute.For<IJwtService>();
        var mockHttpResponse = Substitute.For<HttpResponse>();
        var loginPayload = new LoginPayloadDto
        {
            Email = "test@example.com",
            Password = "invalidPassword",
            ClientId = "testClient"
        };
        var mockAccount = CreateFullAccount();
        mockAccountRepository.GetByEmailAsync(loginPayload.Email).Returns(Task.FromResult(mockAccount));

        var authService = new AuthService(mockAccountRepository, mockJwtService);

        Assert.ThrowsException<ArgumentException>(() => authService.Login(mockHttpResponse, loginPayload));
        await mockAccountRepository.DidNotReceive().UpdateAsync(Arg.Any<Account>());
        mockHttpResponse.Cookies.DidNotReceive().Append(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CookieOptions>());
        mockJwtService.DidNotReceive().CreateToken(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<TimeSpan>());
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