﻿using AuthServer.Data;
using AuthServer.Data.Dto;
using AuthServer.Data.Repositories;
using AuthServer.Service;
using AuthServer.Utils;
using Microsoft.AspNetCore.Mvc;

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
	public async Task<ActionResult<AccessTokenDto>> Login([FromBody] LoginPayloadDto loginPayload)
	{
		await _requestLogger.PrintRequest(nameof(Login), Request);

		try
		{
			var tokenPair = _authService.Login(loginPayload);
			_authService.SetRefreshTokenCookie(Response, tokenPair.RefreshToken);
			return Ok(new AccessTokenDto { AccessToken = tokenPair.AccessToken });
		}
		catch (ArgumentException ex)
		{
			return BadRequest(ex.Message);
		}
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

		try
		{
			// find the account associated with the refresh token
			// if no account is found, the token is invalid

			var refreshClaims = _jwtService.ExtractClaims(refreshToken);
			if (!_jwtService.VerifyAppClaims(refreshClaims, out string? failureMessage))
			{
				Console.WriteLine(failureMessage!);
				return BadRequest(failureMessage!);
			}

			return Ok(new AccessTokenDto
			{
				AccessToken = _jwtService.CreateToken(
					Guid.Parse(refreshClaims.Subject()),
					refreshClaims.Role(),
					refreshClaims.Audience(),
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
	public async Task<ActionResult<TokenPairDto>> InspectTokens()
	{
		await _requestLogger.PrintRequest(nameof(InspectTokens), Request);

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

		try
		{
			var accessClaims = _jwtService.ExtractClaims(accessToken!);
			var refreshClaims = _jwtService.ExtractClaims(refreshToken!);

			bool verifyAccessClaimsResult = _jwtService.VerifyAppClaims(accessClaims, out string? accessFailureMessage);
			bool verifyRefresgClaimsResult = _jwtService.VerifyAppClaims(refreshClaims, out string? refreshFailureMessage);

			if (!verifyAccessClaimsResult || !verifyRefresgClaimsResult)
			{
				return BadRequest(
					"Access claims failure: " + (accessFailureMessage ?? string.Empty) + "; " +
					"Refresh claims failure: " + (refreshFailureMessage ?? string.Empty) + ";"
				);
			}
		}
		catch (Exception ex)
		{
			return BadRequest(ex.Message);
		}

		return Ok(new TokenPairDto
		{
			AccessToken = accessToken!,
			RefreshToken = refreshToken!
		});
	}
}
