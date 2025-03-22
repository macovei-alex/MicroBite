namespace AuthServer.Data.Dto;

public class TokenPairDto
{
	public required string AccessToken { get; set; }
	public required string RefreshToken { get; set; }
}
