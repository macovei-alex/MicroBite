using Microsoft.AspNetCore.Mvc;
using AuthServer.Data.Models;
using AuthServer.Data.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace AuthServer.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AuthenticationRecoveryController(IAuthenticationRecoveryRepository repository) : ControllerBase
{
	private readonly IAuthenticationRecoveryRepository _repository = repository;

	[HttpGet("{id}")]
	public async Task<ActionResult<AuthenticationRecovery>> GetById(int id)
	{
		var recovery = await _repository.GetByIdAsync(id);
		return recovery != null ? Ok(recovery) : NotFound();
	}

	[HttpGet]
	public async Task<ActionResult<List<AuthenticationRecovery>>> GetAll()
	{
		return Ok(await _repository.GetAllAsync());
	}

	[HttpPost]
	public async Task<ActionResult<AuthenticationRecovery>> Create([FromBody] AuthenticationRecovery recovery)
	{
		var createdRecovery = await _repository.AddAsync(recovery);
		return CreatedAtAction(nameof(GetById), new { id = createdRecovery.Id }, createdRecovery);
	}

	[HttpPut("{id}")]
	public async Task<IActionResult> Update(int id, [FromBody] AuthenticationRecovery recovery)
	{
		if (id != recovery.Id) return BadRequest();
		return await _repository.UpdateAsync(recovery) ? NoContent() : NotFound();
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> Delete(int id)
	{
		return await _repository.DeleteAsync(id) ? NoContent() : NotFound();
	}
}