﻿using AuthServer.Data.Dto;
using AuthServer.Data.Repositories;
using AuthServer.Service;
using Isopoh.Cryptography.Argon2;
using Microsoft.AspNetCore.Mvc;

namespace AuthServer.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController
(
	RequestLogger requestLogger,
	JwtService jwtService,
	AccountRepository accountRepository
) : ControllerBase
{
	private readonly RequestLogger _requestLogger = requestLogger;
	private readonly JwtService _jwtService = jwtService;
	private readonly AccountRepository _accountRepository = accountRepository;


	[HttpPost("login")]
	public async Task<ActionResult<AccessTokenDto>> Login([FromBody] LoginPayloadDto loginPayload)
	{
		await _requestLogger.PrintRequest(nameof(Login), Request);

		var account = await _accountRepository.GetByEmailOrPhoneAsync(loginPayload.Email, string.Empty);
		if (account == null)
		{
			return BadRequest("No user account matched the provided credentials");
		}
		if (!Argon2.Verify(account.PasswordHash, loginPayload.Password))
		{
			return BadRequest("Incorrect username or password");
		}

		var accessToken = _jwtService.CreateToken(account.Id, account.Role.Name, JwtService.DefaultAccessTokenExpirationDelay);
		var refreshToken = _jwtService.CreateToken(account.Id, account.Role.Name, JwtService.DefaultRefreshTokenExpirationDelay);

		Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
		{
			HttpOnly = true,
			Secure = false,
			SameSite = SameSiteMode.Strict,
			Expires = DateTime.UtcNow + JwtService.DefaultRefreshTokenExpirationDelay - TimeSpan.FromSeconds(30)
		});

		return Ok(new AccessTokenDto { AccessToken = accessToken });
	}

	[HttpPost("refresh")]
	public async Task<ActionResult<AccessTokenDto>> Refresh()
	{
		await _requestLogger.PrintRequest(nameof(Refresh), Request);

		var refreshToken = Request.Cookies["refreshToken"];

		if (string.IsNullOrEmpty(refreshToken))
		{
			return Unauthorized("Missing refresh token cookie");
		}

		// find the account associated with the refresh token
		// generate new access and refresh tokens
		// set the generated refresh token in the database
		// send the access token in the payload and refresh tokens as an HttpOnly cookie

		return Ok(new AccessTokenDto
		{
			AccessToken = @"This is a placeholder generated by the server. TODO: generate actual access tokens"
		});
	}

	[HttpGet("check-tokens")]
	public async Task<ActionResult<TokenPairDto>> CheckCookies()
	{
		await _requestLogger.PrintRequest(nameof(CheckCookies), Request);

		var refreshToken = Request.Cookies["refreshToken"];
		var accessToken = Request.Headers.Authorization
			.Where(auth => auth != null && auth.StartsWith("Bearer "))
			.Select(auth => auth!["Bearer ".Length..])
			.FirstOrDefault();

		string message =
		(
			(string.IsNullOrEmpty(accessToken) ? "Access token not found; " : string.Empty) +
			(string.IsNullOrEmpty(refreshToken) ? "Refresh token not found; " : string.Empty)
		);

		if (message != string.Empty)
		{
			return BadRequest(message[..^2]);
		}

		return Ok(new TokenPairDto
		{
			AccessToken = accessToken!,
			RefreshToken = refreshToken!
		});
	}
}
