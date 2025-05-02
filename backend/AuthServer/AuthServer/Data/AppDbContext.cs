using AuthServer.Data.Models;
using Isopoh.Cryptography.Argon2;
using Microsoft.EntityFrameworkCore;

namespace AuthServer.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
	public DbSet<Account> Accounts { get; set; }
	public DbSet<AuthenticationRecovery> AuthenticationRecoveries { get; set; }
	public DbSet<Role> Roles { get; set; }


	public void InitializeDataIfNeeded()
	{
		var roles = Roles.Select(r => r.Name);
		if (!roles.Contains(Role.Admin))
		{
			Roles.Add(new Role { Name = Role.Admin });
		}
		if (!roles.Contains(Role.User))
		{
			Roles.Add(new Role { Name = Role.User });
		}
		SaveChanges();

		var accountRoles = Accounts.Select(u => u.Role.Name);
		if (!accountRoles.Contains(Role.Admin))
		{
			Accounts.Add(new Account
			{
				FirstName = "admin",
				LastName = "admin",
				Email = "admin@admin.com",
				PasswordHash = Argon2.Hash("adminadmin"),
				Role = Roles.First(r => r.Name == Role.Admin),
				PhoneNumber = "1234567890",
			});
		}
		SaveChanges();
	}
}