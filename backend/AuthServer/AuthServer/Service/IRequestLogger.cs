namespace AuthServer.Service;

public interface IRequestLogger
{
    Task PrintRequest(string requestName, HttpRequest request);
}