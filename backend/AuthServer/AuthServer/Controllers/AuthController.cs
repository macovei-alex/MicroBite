using AuthServer.Data.Dto;
using AuthServer.Data.Repositories;
using AuthServer.Data.Security;
using AuthServer.Service;
using AuthServer.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Dynamic;

namespace AuthServer.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController(
	RequestLogger requestLogger,
	JwtService jwtService,
	AccountRepository accountRepository,
	AuthService authService
) : ControllerBase
{
	private readonly RequestLogger _requestLogger = requestLogger;
	private readonly JwtService _jwtService = jwtService;
	private readonly AccountRepository _accountRepository = accountRepository;
	private readonly AuthService _authService = authService;

	[HttpPost("login")]
	public ActionResult<AccessTokenDto> Login([FromBody] LoginPayloadDto loginPayload)
	{
		try
		{
			var tokenPair = _authService.Login(Response, loginPayload);
			return Ok(new AccessTokenDto { AccessToken = tokenPair.AccessToken });
		}
		catch (ArgumentException ex)
		{
			return BadRequest(ex.Message);
		}
	}

	[HttpPost("logout")]
	[Authorize]
	public async Task<IActionResult> Logout()
	{
		var jwtUser = JwtUser.GetFromPrincipal(User);

		var account = await _accountRepository.GetByIdAsync(jwtUser.Id);
		if (account == null)
		{
			return BadRequest("Account not found");
		}

		account.RefreshToken = null;
		await _accountRepository.UpdateAsync(account);
		Response.Cookies.Delete("refreshToken");
		return Ok();
	}

	[HttpPost("refresh")]
	public ActionResult<AccessTokenDto> Refresh()
	{
		var refreshToken = Request.Cookies["refreshToken"];
		if (string.IsNullOrEmpty(refreshToken))
		{
			return Unauthorized("Missing refresh token cookie");
		}

		try
		{
			var account = _accountRepository.GetByRefreshToken(refreshToken);
			if (account == null)
			{
				return BadRequest("No account found for the provided refresh token");
			}

			var refreshClaims = _jwtService.ExtractClaims(refreshToken);
			if (!_jwtService.TryVerifyAppClaims(refreshClaims, out string? failureMessage))
			{
				Console.WriteLine(failureMessage!);
				return BadRequest(failureMessage!);
			}

			// may be unnecessary
			if (account.Id != Guid.Parse(refreshClaims.Subject())
				|| account.Role.Name != refreshClaims.Role())
			{
				return Unauthorized("Refresh token does not match account");
			}
			// \

			return Ok(new AccessTokenDto
			{
				AccessToken = _jwtService.CreateToken(
					account.Id, account.Role.Name, refreshClaims.Audience(),
					JwtService.DefaultAccessTokenExpirationDelay
				)
			});
		}
		catch (Exception ex)
		{
			Console.WriteLine(ex.Message);
			return Unauthorized("Invalid refresh token");
		}
	}

	[HttpGet("jwt-inspect")]
	[Authorize]
	public ActionResult<string> InspectTokens()
	{
		var refreshToken = Request.Cookies["refreshToken"];

		if (string.IsNullOrEmpty(refreshToken))
		{
			return BadRequest("Refresh token not found");
		}

		try
		{
			var refreshClaims = _jwtService.ExtractClaims(refreshToken!);
			if (!_jwtService.TryVerifyAppClaims(refreshClaims, out string? failureMessage))
			{
				return BadRequest($"Refresh claims failure ( {failureMessage} )");
			}

			string accessTokenClaims = "Access token claims:\n" + User.Claims
					.Select((claim) => $"{claim.Type}: {claim.Value}")
					.Aggregate((claim1, claim2) => $"{claim1}; {claim2}");

			string refreshTokenClaims = "Refresh token claims:\n" + refreshClaims.Claims
					.Select((claim) => $"{claim.Type}: {claim.Value}")
					.Aggregate((claim1, claim2) => $"{claim1}; {claim2}");

			Console.WriteLine("Access token claims:");
			Console.WriteLine(accessTokenClaims);
			Console.WriteLine("Refresh token claims:");
			Console.WriteLine(refreshTokenClaims);

			return Ok(new
			{
				RefreshToken = refreshToken,
				AccessTokenClaims = accessTokenClaims,
				RefreshTokenClaims = refreshTokenClaims
			});

		}
		catch (Exception ex)
		{
			return BadRequest(ex.Message);
		}
	}
}
