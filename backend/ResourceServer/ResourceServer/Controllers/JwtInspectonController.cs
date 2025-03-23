using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace ResourceServer.Controllers;

[Route("api/jwt-inspect")]
[ApiController]
public class JwtInspectionController : ControllerBase
{
	[HttpGet]
	[Authorize]
	public ActionResult<string> Get()
	{
		var securityToken = HttpContext.Items["SecurityToken"]! as SecurityToken;
		var principal = HttpContext.User;

		return securityToken!.ToString() + "\n" + principal.ToString();
	}
}
