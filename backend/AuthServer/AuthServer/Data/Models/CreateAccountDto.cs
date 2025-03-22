using System.ComponentModel.DataAnnotations;

namespace AuthServer.Data.Models;

public class CreateAccountDto
{
    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    public string PhoneNumber { get; set; }

    [Required]
    public Role Role { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    public string RecoveryQuestion { get; set; }

    [Required]
    public string RecoveryAnswer { get; set; }
}