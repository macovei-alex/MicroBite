using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ResourceServer.Data;
using ResourceServer.Data.Repositories;
using ResourceServer.Service;
using Scalar.AspNetCore;
using System.Security.Cryptography;

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

builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<ProductCategoryRepository>();
builder.Services.AddScoped<OrderRepository>();
builder.Services.AddScoped<OrderItemRepository>();
builder.Services.AddScoped<OrderStatusRepository>();

builder.Services.AddSingleton<JwtKeysService>();
builder.Services.AddSingleton<JwtValidatorService>();

// temporary
var rsa = RSA.Create();
rsa.ImportFromPem(File.ReadAllText("../../AuthServer/AuthServer/dev/public-key.pem"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(x =>
	{
		x.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidIssuer = config["JwtSettings:Issuer"]!,
			ValidateAudience = true,
			ValidAudience = config["JwtSettings:Audience"]!,
			ValidateIssuerSigningKey = true,
			// TODO: Figure out how to use JwtKeysService to set the correct key based on the kid
			IssuerSigningKey = new RsaSecurityKey(rsa),
			ValidateLifetime = true,
		};
	});

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

app.UseHttpsRedirection();

// forgot what it does
// i never knew what it did but it was in the file template,
// so i ll leave it there just in case :)
app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
