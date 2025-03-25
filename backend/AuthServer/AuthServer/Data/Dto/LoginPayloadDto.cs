namespace AuthServer.Data.Dto;

public class LoginPayloadDto
{
	public required string Email { get; set; }
	public required string Password { get; set; }
	public required string ClientId { get; set; }
}
