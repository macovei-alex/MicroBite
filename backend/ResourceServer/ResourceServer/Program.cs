using Microsoft.EntityFrameworkCore;
using ResourceServer.Data;
using ResourceServer.Data.Repositories;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
{
	options.UseNpgsql(builder.Configuration.GetConnectionString("ResourceDb"));
});

builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<ProductCategoryRepository>();
builder.Services.AddScoped<OrderRepository>();
builder.Services.AddScoped<OrderItemRepository>();
builder.Services.AddScoped<OrderStatusRepository>();

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
