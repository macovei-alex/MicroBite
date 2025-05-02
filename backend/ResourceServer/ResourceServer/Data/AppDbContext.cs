using Microsoft.EntityFrameworkCore;
using ResourceServer.Data.Models;

namespace ResourceServer.Data;

public class AppDbContext(DbContextOptions contextOptions) : DbContext(contextOptions)
{
	public DbSet<Product> Products { get; set; }
	public DbSet<ProductCategory> ProductCategories { get; set; }
	public DbSet<Order> Orders { get; set; }
	public DbSet<OrderItem> OrderItems { get; set; }
	public DbSet<OrderStatus> OrderStatuses { get; set; }


	public void InitializeDataIfNeeded()
	{
		if (ProductCategories.Any())
		{
			return;
		}

		ProductCategories.AddRange(new List<ProductCategory>
	   {
		   new() { Name = "Pizza" },
		   new() { Name = "Sushi" },
		   new() { Name = "Bauturi" },
		   new() { Name = "Desert" }
	   });

		SaveChanges();

		Products.AddRange(new List<Product>
	   {
		   new()
		   {
			   Name = "Pizza Margherita",
			   Description = "Pizza cu rosii, mozzarella si busuioc",
			   Price = 25,
			   Category = ProductCategories.First(x => x.Name == "Pizza")
		   },
		   new()
		   {
			   Name = "Sushi Rolls",
			   Description = "Sushi cu somon si avocado",
			   Price = 50,
			   Category = ProductCategories.First(x => x.Name == "Sushi")
		   },
		   new()
		   {
			   Name = "Coca Cola",
			   Description = "Bautura racoritoare",
			   Price = 10,
			   Category = ProductCategories.First(x => x.Name == "Bauturi")
		   },
		   new()
		   {
			   Name = "Cheesecake",
			   Description = "Desert cu branza si biscuiti",
			   Price = 15,
			   Category = ProductCategories.First(x => x.Name == "Desert")
		   },
		   new()
		   {
			   Name = "Pizza Quattro Stagioni",
			   Description = "Pizza cu sunca, ciuperci, ardei si masline",
			   Price = 30,
			   Category = ProductCategories.First(x => x.Name == "Pizza")
		   },
	   });

		SaveChanges();

		List<string> statuses = [OrderStatus.Received, OrderStatus.Processing, OrderStatus.Completed];
		foreach (var status in statuses)
		{
			if (!OrderStatuses.Where(o => o.Name == status).Any())
			{
				OrderStatuses.Add(new OrderStatus { Name = status, });
			}
		}

		SaveChanges();
	}
}