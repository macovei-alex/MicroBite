using Microsoft.AspNetCore.Mvc;
using AuthServer.Data.Models;
using AuthServer.Data.Repositories;
using Isopoh.Cryptography.Argon2;
using AuthServer.Data.Dto;
using Microsoft.AspNetCore.Authorization;
using AuthServer.Service;
using AuthServer.Data.Security;

namespace AuthServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController(IAccountRepository repository,
							IRoleRepository roleRepository,
							IAuthService authService) : ControllerBase
{
	private readonly IAccountRepository _repository = repository;
	private readonly IRoleRepository _roleRepository = roleRepository;
	private readonly IAuthService _authService = authService;

	[HttpGet("{id}")]
	[Authorize]
	public async Task<ActionResult<Account>> GetById([FromRoute] Guid id)
	{
		var account = await _repository.GetByIdAsync(id);
		return account != null ? Ok(account) : NotFound();
	}

	[HttpGet]
	public async Task<ActionResult<List<Account>>> GetAll()
	{
		return Ok(await _repository.GetAllAsync());
	}

	[HttpPost("/api/register")]
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

		var role = await _roleRepository.GetByNameAsync(Role.User);
		if (role == null)
		{
			return BadRequest($"The role ( {Role.User} ) could not be found in the database");
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
			RefreshToken = null,
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

	[HttpGet("profile")]
	[Authorize]
	public async Task<ActionResult<AccountDto>> GetProfile()
	{
		var jwtUser = JwtUser.GetFromPrincipal(User);

		var account = await _repository.GetByIdAsync(jwtUser.Id);
		if (account == null)
		{
			return NotFound("User not found");
		}

		var accountDto = new AccountDto
		{
			FirstName = account.FirstName,
			LastName = account.LastName,
			Email = account.Email,
			PhoneNumber = account.PhoneNumber,
			SecurityQuestion = account.AuthenticationRecovery?.SecurityQuestion,
		};

		return Ok(accountDto);
	}


	[HttpPut("profile")]
	[Authorize]
	public async Task<IActionResult> UpdateProfile([FromBody] UserProfileUpdateDto model)
	{
		var jwtUser = JwtUser.GetFromPrincipal(User);

		var user = await _repository.GetByIdAsync(jwtUser.Id);
		if (user == null) return NotFound("User not found");

		user.Email = model.Email;
		user.FirstName = model.FirstName;
		user.LastName = model.LastName;
		user.PhoneNumber = model.PhoneNumber;

		if (!string.IsNullOrWhiteSpace(model.SecurityQuestion) && !string.IsNullOrWhiteSpace(model.SecurityAnswer))
		{
			if (user.AuthenticationRecovery == null)
			{
				user.AuthenticationRecovery = new AuthenticationRecovery
				{
					SecurityQuestion = model.SecurityQuestion,
					SecurityAnswerHash = Argon2.Hash(model.SecurityAnswer)
				};
			}
			else
			{
				user.AuthenticationRecovery.SecurityQuestion = model.SecurityQuestion;
				user.AuthenticationRecovery.SecurityAnswerHash = Argon2.Hash(model.SecurityAnswer);
			}
		}
		await _repository.UpdateAsync(user);

		var updatedUserDto = new AccountDto
		{
			FirstName = user.FirstName,
			LastName = user.LastName,
			Email = user.Email,
			PhoneNumber = user.PhoneNumber,
			SecurityQuestion = user.AuthenticationRecovery?.SecurityQuestion
		};

		return Ok(updatedUserDto);
	}

	[HttpPost("password-reset")]
	public async Task<ActionResult<AccessTokenDto>> PasswordReset([FromBody] PasswordChangePayloadDto passwordChangePayload)
	{
		var account = await _repository.GetByEmailAsync(passwordChangePayload.Email);
		if (account == null)
		{
			return BadRequest("Incorrect email address");
		}
		if (!Argon2.Verify(account.AuthenticationRecovery!.SecurityAnswerHash, passwordChangePayload.SecurityAnswer))
		{
			return BadRequest("Incorrect security answer");
		}

		account.PasswordHash = Argon2.Hash(passwordChangePayload.NewPassword);
		_repository.UpdateAsync(account).Wait();

		try
		{
			var tokenPair = _authService.Login(Response, Request.IsHttps, new LoginPayloadDto
			{
				Email = passwordChangePayload.Email,
				Password = passwordChangePayload.NewPassword,
				ClientId = passwordChangePayload.ClientId
			});
			return Ok(new AccessTokenDto { AccessToken = tokenPair.AccessToken });
		}
		catch (ArgumentException ex)
		{
			return BadRequest(ex.Message);
		}
	}

	[HttpGet("security-question")]
	public async Task<IActionResult> GetSecurityQuestion([FromQuery] string email)
	{
		var user = await _repository.GetByEmailAsync(email);
		if (user == null)
		{
			return NotFound("User not found");
		}

		if (user.AuthenticationRecovery?.SecurityQuestion == null)
		{
			return NoContent();
		}

		return Ok(new { user.AuthenticationRecovery!.SecurityQuestion });
	}
}