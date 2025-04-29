using AuthServer.Data.Dto;
using AuthServer.Data.Repositories;
using Isopoh.Cryptography.Argon2;

namespace AuthServer.Service;

public class AuthService(IAccountRepository accountRepository, IJwtService jwtService) : IAuthService
{
	private readonly IAccountRepository _accountRepository = accountRepository;
	private readonly IJwtService _jwtService = jwtService;

	public TokenPairDto Login(HttpResponse response, bool isHttps, LoginPayloadDto loginPayload)
	{
		var account = _accountRepository.GetByEmailAsync(loginPayload.Email).Result ?? throw new ArgumentException("No user account matched the provided credentials");

		if (!Argon2.Verify(account.PasswordHash, loginPayload.Password))
			throw new ArgumentException("Incorrect username or password");

		var accessToken = _jwtService.CreateToken(account.Id, account.Role.Name, loginPayload.ClientId, JwtService.DefaultAccessTokenExpirationDelay);
		var refreshToken = _jwtService.CreateToken(account.Id, account.Role.Name, loginPayload.ClientId, JwtService.DefaultRefreshTokenExpirationDelay);

		account.RefreshToken = refreshToken;
		_accountRepository.UpdateAsync(account).Wait();

		SetRefreshTokenCookie(response, isHttps, refreshToken);

		return new TokenPairDto
		{
			AccessToken = accessToken,
			RefreshToken = refreshToken
		};
	}

	private static void SetRefreshTokenCookie(HttpResponse response, bool isHttps, string token)
	{
		response.Cookies.Append("refreshToken", token, new CookieOptions
		{
			HttpOnly = true,
			Secure = isHttps,
			SameSite = SameSiteMode.Strict,
			Expires = DateTime.UtcNow + JwtService.DefaultRefreshTokenExpirationDelay - TimeSpan.FromSeconds(30)
		});
	}
}