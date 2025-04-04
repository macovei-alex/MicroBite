using Microsoft.AspNetCore.SignalR;

namespace ResourceServer.Controllers;

public class NotificationsHub : Hub
{
	public const string ApiRoute = "/api/notifications";

	public override async Task OnConnectedAsync()
	{
		Console.WriteLine("Client connected");
		await base.OnConnectedAsync();
	}

	public override async Task OnDisconnectedAsync(Exception? ex)
	{
		Console.WriteLine("Client disconnected");
		await base.OnDisconnectedAsync(ex);
	}
}
