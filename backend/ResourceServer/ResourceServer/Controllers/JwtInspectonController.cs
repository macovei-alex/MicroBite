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
		Console.WriteLine(User.Claims.Count());
		foreach (var claim in User.Claims)
		{
			Console.WriteLine($"{claim.Type} {claim.Value}");
		}

		return User.Claims
			.Select((claim) => $"{claim.Type}: {claim.Value}")
			.Aggregate((claim1, claim2) => $"{claim1}\n{claim2}");
	}
}
