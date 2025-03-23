using AuthServer.Data;
using AuthServer.Data.Repositories;
using AuthServer.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

Debug.Assert(File.Exists(config["JwtSettings:PrivateKeyPath"]!));
Debug.Assert(File.Exists(config["JwtSettings:PublicKeyPath"]!));

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
{
	options.UseNpgsql(config.GetConnectionString("AuthDb"));
});

builder.Services.AddScoped<AccountRepository>();
builder.Services.AddScoped<AuthenticationRecoveryRepository>();
builder.Services.AddScoped<RoleRepository>();

builder.Services.AddSingleton<RequestLogger>();
builder.Services.AddSingleton<JwtService>();

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

var decondingRsa = RSA.Create();
decondingRsa.ImportFromPem(File.ReadAllText(config["JwtSettings:PublicKeyPath"]!));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(x =>
	{
		x.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidIssuer = config["JwtSettings:Issuer"]!,
			ValidateAudience = true,
			ValidAudiences = config.GetSection("JwtSettings:Audiences").Get<string[]>()!,
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = new RsaSecurityKey(decondingRsa),
			ValidateLifetime = true,
		};
	});

builder.Services.AddAuthorization();

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
