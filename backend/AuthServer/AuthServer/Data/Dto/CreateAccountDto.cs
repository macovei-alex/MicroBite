using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace AuthServer.Data.Dto;

public class CreateAccountDto
{
	[Required]
	public required string FirstName { get; set; }

	[Required]
	public required string LastName { get; set; }

	[Required]
	public required string Email { get; set; }

	[Required]
	public required string PhoneNumber { get; set; }

	[Required]
	[StringLength(256, MinimumLength = 10)]
	public required string Password { get; set; }

	[Required]
	public required string RecoveryQuestion { get; set; }

	[Required]
	public required string RecoveryAnswer { get; set; }
}
