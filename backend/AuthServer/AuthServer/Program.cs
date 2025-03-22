using AuthServer.Data;
using AuthServer.Data.Repositories;
using AuthServer.Service;
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

builder.Services.AddSingleton<RequestLogger>();

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

app.UseCors("AllowAnyOrigin");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
