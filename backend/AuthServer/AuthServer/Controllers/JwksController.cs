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
		var rsaKey = (_jwtService.SecurityKey as RsaSecurityKey)
			?? throw new NotImplementedException("Jwks for something other than RSA keys was not implemented");
		try
		{
			var jwks = JwksDto.FromRsaSecurityKey(rsaKey);
			return Ok(new[] { jwks });
		}
		catch (ArgumentException ex)
		{
			return BadRequest(ex.Message);
		}
	}
}
