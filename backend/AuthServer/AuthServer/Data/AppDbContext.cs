using AuthServer.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthServer.Data
{
	public class AppDbContext : DbContext
	{
		public DbSet<Account> Accounts { get; set; }
		public DbSet<AuthenticationRecovery> AuthenticationRecoveries { get; set; }
		public DbSet<Role> Roles { get; set; }

		public AppDbContext(DbContextOptions options) : base(options)
		{

		}
	}
}
