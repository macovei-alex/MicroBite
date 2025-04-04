using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using ResourceServer.Controllers;
using ResourceServer.Data;
using ResourceServer.Data.Repositories;
using ResourceServer.Service;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
{
	options.UseNpgsql(config.GetConnectionString("ResourceDb")!);
});

builder.Services.AddMemoryCache();

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductCategoryRepository, ProductCategoryRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderItemRepository, OrderItemRepository>();
builder.Services.AddScoped<IOrderStatusRepository, OrderStatusRepository>();

builder.Services.AddSingleton<JwtKeysService>();

// Custom authentiation service because I cannot find a way to make
// the jwks endpoint work only with the provided JwtBearer configuration
builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = "Jwt";
	options.DefaultChallengeScheme = "Jwt";
})
.AddScheme<AuthenticationSchemeOptions, JwtAuthenticationService>("Jwt", options => { });

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAnyOrigin",
		builder =>
		{
			builder.SetIsOriginAllowed(_ => true)
				   .AllowAnyMethod()
				   .AllowAnyHeader()
				   .AllowCredentials();
		});
});

builder.Services.AddSignalR();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();

	// scalar UI
	app.MapScalarApiReference();

	// swagger UI
	app.UseSwaggerUI(options =>
	{
		options.SwaggerEndpoint("/openapi/v1.json", "ResourceServer v1");
	});

	// toggle between launchUrl in launchSettings.json to change the default documentation UI
}

app.UseCors("AllowAnyOrigin");

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapHub<NotificationsHub>(NotificationsHub.ApiRoute);
app.MapControllers();

app.Run();
