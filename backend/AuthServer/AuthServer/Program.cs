using AuthServer.Data;
using AuthServer.Data.Repositories;
using AuthServer.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Diagnostics;
using Microsoft.AspNetCore.Authentication;
using AuthServer.Data.Models;
using Isopoh.Cryptography.Argon2;

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

builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IAuthenticationRecoveryRepository, AuthenticationRecoveryRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();

builder.Services.AddSingleton<IRequestLogger, RequestLogger>();
builder.Services.AddSingleton<IJwtService, JwtService>();
builder.Services.AddScoped<IClaimsTransformation, JwtClaimsTransformer>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddSingleton<IBackupService, PostgresAuthBackupService>();
builder.Services.AddHostedService<BackupSchedulerService>();

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
		x.MapInboundClaims = false;
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

using (var scope = app.Services.CreateScope())
{
	var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
	db.Database.EnsureCreated();

	var roles = db.Roles.Select(r => r.Name);
	if (!roles.Contains(Role.Admin))
	{
		db.Roles.Add(new Role { Name = Role.Admin });
	}
	if (!roles.Contains(Role.User))
	{
		db.Roles.Add(new Role { Name = Role.User });
	}
	db.SaveChanges();

	var accountRoles = db.Accounts.Select(u => u.Role.Name);
	if (!accountRoles.Contains(Role.Admin))
	{
		db.Accounts.Add(new Account
		{
			FirstName = "admin",
			LastName = "admin",
			Email = "admin@admin.com",
			PasswordHash = Argon2.Hash("adminadmin"),
			Role = db.Roles.First(r => r.Name == Role.Admin),
			PhoneNumber = "1234567890",
		});
	}
	db.SaveChanges();
}

app.UseCors("AllowAnyOrigin");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
