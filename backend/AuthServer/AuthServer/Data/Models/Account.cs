using System.ComponentModel.DataAnnotations;

namespace AuthServer.Data.Models;

public class Account
{
	[Key]
	[Required]
	public Guid Id { get; set; }

	public AuthenticationRecovery? AuthenticationRecovery { get; set; }

	[Required]
	public required Role Role { get; set; }

	[Required]
	public required string FirstName { get; set; }

	[Required]
	public required string LastName { get; set; }

	[Required]
	public required string Email { get; set; }

	[Required]
	public required string PhoneNumber { get; set; }

	[Required]
	public required string PasswordHash { get; set; }

	public string? RefreshToken { get; set; }
}