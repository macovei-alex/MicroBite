using AuthServer.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthServer.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
	public DbSet<Account> Accounts { get; set; }
	public DbSet<AuthenticationRecovery> AuthenticationRecoveries { get; set; }
	public DbSet<Role> Roles { get; set; }
}
