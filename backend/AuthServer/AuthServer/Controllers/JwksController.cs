using AuthServer.Data.Dto;
using AuthServer.Service;
using Microsoft.AspNetCore.Mvc;

namespace AuthServer.Controllers;

[ApiController]
[Route("api/.well-known/jwks.json")]
public class JwksController(IJwtService jwtService, IRequestLogger requestLogger) : ControllerBase
{
	private readonly IJwtService _jwtService = jwtService;
	private readonly IRequestLogger _requestLogger = requestLogger;

	[HttpGet]
	public async Task<ActionResult<JwksDto[]>> GetJwks()
	{
		await _requestLogger.PrintRequest(nameof(GetJwks), Request);

		try
		{
			var jwks = JwksDto.FromSecurityKey(_jwtService.DecryptKey, _jwtService.SigningCredentials.Algorithm);
			return Ok(new { keys = new[] { jwks } });
		}
		catch (ArgumentException ex)
		{
			return BadRequest(ex.Message);
		}
	}
}
