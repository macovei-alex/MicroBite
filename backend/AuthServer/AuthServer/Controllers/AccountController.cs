﻿using Microsoft.AspNetCore.Mvc;
using AuthServer.Data.Models;
using AuthServer.Data.Repositories;
using Isopoh.Cryptography.Argon2;
using AuthServer.Data.Dto;
using Microsoft.AspNetCore.Authorization;
using AuthServer.Data;

namespace AuthServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController(AccountRepository repository, RoleRepository roleRepository) : ControllerBase
{
	private readonly AccountRepository _repository = repository;
	private readonly RoleRepository _roleRepository = roleRepository;

	[HttpGet("{id}")]
	[Authorize]
	public async Task<ActionResult<Account>> GetById([FromRoute] Guid id)
	{
		// example for accessing and using decoded jwt claims of a request access token

		Console.WriteLine(HttpContext.User.Claims.Count());
		foreach (var claim in HttpContext.User.Claims)
		{
			Console.WriteLine($"{claim.Type} {claim.Value}");
		}
		Console.WriteLine(HttpContext.User.FindFirst(JwtAppValidClaims.Subject)!.Value);
		Console.WriteLine(HttpContext.User.FindFirst(JwtAppValidClaims.Role)!.Value);

		//

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
		{
			return BadRequest(ModelState);
		}

		var existingAccount = await _repository.GetByEmailOrPhoneAsync(accountDto.Email, accountDto.PhoneNumber);
		if (existingAccount != null)
		{
			return Conflict("An account with the same email or phone number already exists.");
		}

		var role = await _roleRepository.GetByNameAsync(accountDto.Role);
		if (role == null)
		{
			return BadRequest("The provided role does not exist");
		}

		var passwordHash = Argon2.Hash(accountDto.Password);
		var recoveryAnswerHash = Argon2.Hash(accountDto.RecoveryAnswer);

		var account = new Account
		{
			FirstName = accountDto.FirstName,
			LastName = accountDto.LastName,
			Email = accountDto.Email,
			PhoneNumber = accountDto.PhoneNumber,
			Role = role,
			PasswordHash = passwordHash,
			AuthenticationRecovery = new AuthenticationRecovery
			{
				SecurityQuestion = accountDto.RecoveryQuestion,
				SecurityAnswerHash = recoveryAnswerHash
			}
		};

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