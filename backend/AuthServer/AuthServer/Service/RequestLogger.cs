namespace AuthServer.Service;

public class RequestLogger : IRequestLogger
{
	private readonly SemaphoreSlim _semaphore = new(1, 1);

	public async Task PrintRequest(string requestName, HttpRequest request)
	{
		await _semaphore.WaitAsync();

		try
		{
			Console.WriteLine($"Request: {requestName} {{");

			foreach (var header in request.Headers)
				Console.WriteLine($"\tHeader: {header.Key} = {header.Value}");

			Console.WriteLine();

			foreach (var cookie in request.Cookies)
				Console.WriteLine($"\tCookie: {cookie.Key} = {cookie.Value}");

			Console.WriteLine();

			request.EnableBuffering();

			using var reader = new StreamReader(request.Body);
			var body = await reader.ReadToEndAsync();
			Console.WriteLine($"\tRequest Body: {body}");
			request.Body.Seek(0, SeekOrigin.Begin);

			Console.WriteLine("}");
		}
		catch (Exception ex)
		{
			Console.WriteLine($"An exception occured while trying to log the request: {ex.Message}");
		}
		finally
		{
			_semaphore.Release();
		}
	}
}