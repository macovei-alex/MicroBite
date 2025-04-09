namespace AuthServer.Data.Dto;

public class AccountDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string? SecurityQuestion { get; set; }
}