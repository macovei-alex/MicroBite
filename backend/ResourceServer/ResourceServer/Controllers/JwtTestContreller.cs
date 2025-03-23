using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ResourceServer.Controllers;

[Route("api/jwt-test")]
[ApiController]
public class JwtTestController : ControllerBase
{
	[HttpGet]
	[Authorize]
	public ActionResult<IEnumerable<string>> Get()
	{
		return Request.Headers.Authorization;
	}
}
