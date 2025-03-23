using AuthServer.Data.Dto;
using AuthServer.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace AuthServer.Controllers;

[ApiController]
[Route(".well-known/jwks.json")]
public class JwksController(JwtService jwtService, RequestLogger requestLogger) : ControllerBase
{
	private readonly JwtService _jwtService = jwtService;
	private readonly RequestLogger _requestLogger = requestLogger;

	[HttpGet]
	public async Task<ActionResult<JwksDto[]>> GetJwks()
	{
		await _requestLogger.PrintRequest(nameof(GetJwks), Request);

		try
		{
			var jwks = JwksDto.FromSecurityKey(_jwtService.SecurityKey, _jwtService.SigningCredentials.Algorithm);
			return Ok(new { keys = new[] { jwks } });
		}
		catch (ArgumentException ex)
		{
			return BadRequest(ex.Message);
		}
	}
}
