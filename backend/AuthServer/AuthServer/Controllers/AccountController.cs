using Microsoft.AspNetCore.Mvc;
using AuthServer.Data.Models;
using AuthServer.Data.Repositories;

namespace AuthServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController(AccountRepository repository) : ControllerBase
{
    private readonly AccountRepository _repository = repository;

    [HttpGet("{id}")]
    public async Task<ActionResult<Account>> GetById(Guid id)
    {
        var account = await _repository.GetByIdAsync(id);
        return account != null ? Ok(account) : NotFound();
    }

    [HttpGet]
    public async Task<ActionResult<List<Account>>> GetAll()
    {
        return Ok(await _repository.GetAllAsync());
    }

    [HttpPost]
    public async Task<ActionResult<Account>> Create([FromBody] Account account)
    {
        var createdAccount = await _repository.AddAsync(account);
        return CreatedAtAction(nameof(GetById), new { id = createdAccount.Id }, createdAccount);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Account account)
    {
        if (id != account.Id) return BadRequest();
        return await _repository.UpdateAsync(account) ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        return await _repository.DeleteAsync(id) ? NoContent() : NotFound();
    }
}