namespace AuthServer.Data.Dto;

public class UserProfileUpdateDto
{
    public required string Email { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string PhoneNumber { get; set; }
    public string? SecurityQuestion { get; set; }
    public string? SecurityAnswer { get; set; }
}