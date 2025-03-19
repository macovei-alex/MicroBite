using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthServer.Data.Models;

public class AuthenticationRecovery
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public int Id { get; set; }

	[Required]
	public required string SecurityQuestion { get; set; }

	[Required]
	public required string SecurityAnswerHash { get; set; }
}
