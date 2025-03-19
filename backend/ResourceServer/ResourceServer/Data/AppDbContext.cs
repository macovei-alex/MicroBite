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
}