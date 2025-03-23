using AuthServer.Data.Dto;
using AuthServer.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace AuthServer.Controllers;

[ApiController]
[Route(".well-known/jwks.json")]
public class JwksController(JwtService jwtService) : ControllerBase
{
	private readonly JwtService _jwtService = jwtService;

	[HttpGet]
	public ActionResult<JwksDto[]> GetJwks()
	{
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
