using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
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
builder.Services.AddScoped<IOrderItemRepository,OrderItemRepository>();
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

// forgot what it does
// i never knew what it did but it was in the file template,
// so i ll leave it there just in case :)
app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
