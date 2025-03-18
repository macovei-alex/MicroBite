using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ResourceServer.Data;
using ResourceServer.Data.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("ResourceDb"));
});

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ResourceServer",
        Version = "v1"
    });
});

builder.Services.AddScoped<ProductRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ResourceServer v1");
    });
}

app.UseHttpsRedirection();

//app.UseRouting(); // forgot what it does

app.UseAuthorization();

app.MapControllers();

app.Run();
