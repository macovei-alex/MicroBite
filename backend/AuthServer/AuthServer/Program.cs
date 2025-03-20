using AuthServer.Data;
using AuthServer.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
{
	options.UseNpgsql(builder.Configuration.GetConnectionString("AuthDb"));
});

builder.Services.AddScoped<AccountRepository>();
builder.Services.AddScoped<AuthenticationRecoveryRepository>();
builder.Services.AddScoped<RoleRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();

	// scalar UI
	app.MapScalarApiReference();

	// swagger UI
	app.UseSwaggerUI(options =>
	{
		options.SwaggerEndpoint("/openapi/v1.json", "Auth Server");
	});

	// toggle between launchUrl in launchSettings.json to change the default documentation UI
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
