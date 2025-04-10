using AuthServer.Data.Dto;

namespace AuthServer.Service;

public interface IAuthService
{
	public TokenPairDto Login(HttpResponse response, bool isHttps, LoginPayloadDto loginPayload);
}