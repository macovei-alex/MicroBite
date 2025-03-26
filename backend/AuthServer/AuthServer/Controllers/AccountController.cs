using Microsoft.AspNetCore.Mvc;
using AuthServer.Data.Models;
using AuthServer.Data.Repositories;
using Isopoh.Cryptography.Argon2;
using AuthServer.Data.Dto;
using Microsoft.AspNetCore.Authorization;
using AuthServer.Data;
using AuthServer.Service;

namespace AuthServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController(
	AccountRepository repository,
	RoleRepository roleRepository,
	AuthService authService,
	JwtService jwtService
) : ControllerBase
{
	private readonly AccountRepository _repository = repository;
	private readonly RoleRepository _roleRepository = roleRepository;
	private readonly AuthService _authService = authService;
	private readonly JwtService _jwtService = jwtService;

	[HttpGet("{id}")]
	[Authorize]
	public async Task<ActionResult<Account>> GetById([FromRoute] Guid id)
	{
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

	[HttpPut("change-password")]
	public async Task<ActionResult<AccessTokenDto>> ChangePassword([FromBody] PasswordChangePayloadDto passwordChangePayload)
	{
		var account = await _repository.GetByEmailAsync(passwordChangePayload.Email);
		if (account == null)
		{
			return BadRequest("Incorrect email address");
		}

		try
		{
			var tokenPair = _authService.Login(new LoginPayloadDto
			{
				Email = passwordChangePayload.Email,
				Password = passwordChangePayload.NewPassword,
				ClientId = passwordChangePayload.ClientId
			});
			_authService.SetRefreshTokenCookie(Response, tokenPair.RefreshToken);
			return Ok(new AccessTokenDto
			{
				AccessToken = tokenPair.AccessToken
			});
		}
		catch (ArgumentException ex)
		{
			return BadRequest(ex.Message);
		}
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

	[HttpGet("profile")]
	[Authorize]
	public async Task<ActionResult<AccountDto>> GetProfile()
	{
		var userId = Guid.Parse(HttpContext.User.FindFirst(JwtAppValidClaims.Subject)!.Value);

		var account = await _repository.GetByIdAsync(userId);
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
		var userId = Guid.Parse(HttpContext.User.FindFirst(JwtAppValidClaims.Subject)!.Value);

		var user = await _repository.GetByIdAsync(userId);
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
}