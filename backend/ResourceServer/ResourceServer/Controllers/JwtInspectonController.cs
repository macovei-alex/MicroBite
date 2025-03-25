using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ResourceServer.Controllers;

[Route("api/jwt-inspect")]
[ApiController]
public class JwtInspectionController : ControllerBase
{
	[HttpGet]
	[Authorize]
	public ActionResult<string> Get()
	{
		Console.WriteLine(HttpContext.User.Claims.Count());
		foreach (var claim in HttpContext.User.Claims)
		{
			Console.WriteLine($"{claim.Type} {claim.Value}");
		}

		return HttpContext.User.Claims
			.Select((claim) => $"{claim.Type}: {claim.Value}")
			.Aggregate((claim1, claim2) => $"{claim1}\n{claim2}");
	}
}
