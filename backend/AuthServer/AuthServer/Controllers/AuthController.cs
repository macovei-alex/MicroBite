using AuthServer.Data.Dto;
using AuthServer.Service;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;

namespace AuthServer.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController(RequestLogger requestLogger) : ControllerBase
{
	private readonly RequestLogger _requestLogger = requestLogger;


	[HttpPost("login")]
	public async Task<ActionResult<AccessTokenDto>> Login([FromBody] LoginPayloadDto loginPayload)
	{
		await _requestLogger.PrintRequest(nameof(Login), Request);

		// TODO: Remove this after testing slow response times frontend handling
		await Task.Delay(3000);

		// TODO: Generate actual tokens
		var accessToken = loginPayload.Email;
		var refreshToken = loginPayload.Password;

		Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
		{
			HttpOnly = true,
			Secure = false,
			SameSite = SameSiteMode.Strict,
			// TODO: Change the duration to ~30 days for production environments
			Expires = DateTime.UtcNow.AddHours(1)
		});

		return Ok(new AccessTokenDto { AccessToken = accessToken });
	}

	[HttpPost("refresh")]
	public async Task<ActionResult<AccessTokenDto>> Refresh()
	{
		await _requestLogger.PrintRequest(nameof(Refresh), Request);

		// TODO: Remove this after testing the frontend for slow response times
		await Task.Delay(3000);

		var refreshToken = Request.Cookies["refreshToken"];
		Console.WriteLine($"Refresh token: ( {refreshToken} )");

		if (string.IsNullOrEmpty(refreshToken))
		{
			return Unauthorized(new { message = "Missing refresh token cookie" });
		}

		// find the account associated with the refresh token
		// generate new access and refresh tokens
		// set the generated refresh token in the database
		// send the access token in the payload and refresh tokens as an HttpOnly cookie

		return Ok(new AccessTokenDto { AccessToken = "TODO: generate access token" });
	}

	[HttpGet("check-tokens")]
	public async Task<ActionResult<TokenPairDto>> CheckCookies()
	{
		await _requestLogger.PrintRequest(nameof(CheckCookies), Request);

		// TODO: Remove this after testing slow server response times on frontend
		await Task.Delay(3000);

		var refreshToken = Request.Cookies["refreshToken"];
		var accessToken = Request.Headers.Authorization
			.FirstOrDefault(auth => auth?.StartsWith("Bearer") ?? false);

		string message = string.Empty;

		if (string.IsNullOrEmpty(refreshToken))
		{
			message += "Refresh token not found; ";
		}

		if (string.IsNullOrEmpty(accessToken))
		{
			message += "Access token not found; ";
		}

		if (message != string.Empty)
		{
			message = message.Substring(0, message.Length - 2);
			return BadRequest(new { message });
		}

		return Ok(new TokenPairDto
		{
			AccessToken = accessToken,
			RefreshToken = refreshToken
		});
	}
}
