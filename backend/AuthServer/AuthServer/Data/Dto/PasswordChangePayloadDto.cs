namespace AuthServer.Data.Dto;

public class PasswordChangePayloadDto
{
	public required string Email { get; set; }
	public required string SecurityAnswer { get; set; }
	public required string NewPassword { get; set; }
	public required string ClientId { get; set; }
}