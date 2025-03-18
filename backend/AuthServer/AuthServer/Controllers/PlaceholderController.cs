using AuthServer.Data.Models;
using AuthServer.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace AuthServer.Controllers;

// placeholder controller so that the folder doesn't dissapear from git until
// the first useful controller appears

[Route("api/[controller]")]
[ApiController]
public class PlaceholderController(AccountRepository accountRepository) : ControllerBase
{
	private readonly AccountRepository _accountRepository = accountRepository;

	[HttpGet("/all")]
	public ActionResult<List<Account>> GetAll()
	{
		return _accountRepository.GetAll();
	}
}
