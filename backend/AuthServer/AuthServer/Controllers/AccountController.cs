using Microsoft.AspNetCore.Mvc;
using AuthServer.Data.Models;
using AuthServer.Data.Repositories;
using Isopoh.Cryptography.Argon2;

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
    public async Task<IActionResult> Create([FromBody] CreateAccountDto accountDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existingAccount = await _repository.GetByEmailOrPhoneAsync(accountDto.Email, accountDto.PhoneNumber);
        if (existingAccount != null)
            return Conflict("An account with the same email or phone number already exists.");

        var passwordHash = Argon2.Hash(accountDto.Password);
        var recoveryAnswerHash = Argon2.Hash(accountDto.RecoveryAnswer);

        var account = new Account
        {
            Id = Guid.NewGuid(),
            FirstName = accountDto.FirstName,
            LastName = accountDto.LastName,
            Email = accountDto.Email,
            PhoneNumber = accountDto.PhoneNumber,
            Role = accountDto.Role,
            PasswordHash = passwordHash,
            AuthenticationRecovery = new AuthenticationRecovery
            {
                SecurityQuestion = accountDto.RecoveryQuestion,
                SecurityAnswerHash = recoveryAnswerHash
            }
        };

        var createdAccount = await _repository.AddAsync(account);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdAccount.Id },
            createdAccount
        );
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