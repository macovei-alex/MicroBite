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
	public async Task<IActionResult> Login([FromBody] LoginPayloadDto loginPayload)
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
			Expires = DateTime.UtcNow.AddMinutes(1)
		});

		var response = Ok(new { accessToken });

		return response;
	}

	[HttpPost("refresh")]
	public async Task<IActionResult> Refresh()
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

		return Ok(new { accessToken = "TODO: generate access token" });
	}

	[HttpGet("check-cookies")]
	public async Task<IActionResult> CheckCookies()
	{
		await _requestLogger.PrintRequest(nameof(CheckCookies), Request);

		// TODO: Remove this after testing slow response times frontend handling
		await Task.Delay(3000);

		var refreshToken = Request.Cookies["refreshToken"];
		var accessToken = Request.Headers.Authorization;

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
			return Unauthorized(new { message });
		}

		return Ok(new { accessToken, refreshToken });
	}
}
