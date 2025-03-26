using Microsoft.EntityFrameworkCore;
using AuthServer.Data.Models;

namespace AuthServer.Data.Repositories;

public class AccountRepository(AppDbContext context)
{
	private readonly AppDbContext _context = context;

	public async Task<Account?> GetByIdAsync(Guid id)
	{
		return await _context.Accounts
			.Include(a => a.Role)
			.Include(a => a.AuthenticationRecovery)
			.FirstOrDefaultAsync(a => a.Id == id);
	}

	public async Task<Account?> GetByEmailAsync(string email)
	{
		return await _context.Accounts
			.Include(a => a.Role)
			.Include(a => a.AuthenticationRecovery)
			.FirstOrDefaultAsync(a => a.Email == email);
	}

	public async Task<Account?> GetByEmailOrPhoneAsync(string email, string phoneNumber)
	{
		return await _context.Accounts
			.Include(a => a.Role)
			.Include(a => a.AuthenticationRecovery)
			.FirstOrDefaultAsync(a => a.Email == email || a.PhoneNumber == phoneNumber);
	}

	public async Task<List<Account>> GetAllAsync()
	{
		return await _context.Accounts
			.Include(a => a.Role)
			.Include(a => a.AuthenticationRecovery)
			.ToListAsync();
	}

	public async Task<Account> AddAsync(Account account)
	{
		_context.Accounts.Add(account);
		await _context.SaveChangesAsync();
		return account;
	}

	public async Task<bool> UpdateAsync(Account account)
	{
		var existingAccount = await _context.Accounts
			.Include(a => a.Role)
			.Include(a => a.AuthenticationRecovery)
			.FirstOrDefaultAsync(a => a.Id == account.Id);

		if (existingAccount == null) return false;

		_context.Entry(existingAccount).CurrentValues.SetValues(account);

		if (account.Role != null)
		{
			var existingRole = await _context.Roles.FindAsync(account.Role.Id);
			if (existingRole != null)
			{
				_context.Entry(existingRole).CurrentValues.SetValues(account.Role);
				existingAccount.Role = existingRole;
			}
			else
			{
				_context.Roles.Add(account.Role);
				existingAccount.Role = account.Role;
			}
		}
		if (account.AuthenticationRecovery != null)
		{
			var existingRecovery = await _context.AuthenticationRecoveries.FindAsync(account.AuthenticationRecovery.Id);
			if (existingRecovery != null)
			{
				_context.Entry(existingRecovery).CurrentValues.SetValues(account.AuthenticationRecovery);
				existingAccount.AuthenticationRecovery = existingRecovery;
			}
			else
			{
				_context.AuthenticationRecoveries.Add(account.AuthenticationRecovery);
				existingAccount.AuthenticationRecovery = account.AuthenticationRecovery;
			}
		}
		return await _context.SaveChangesAsync() > 0;
	}

	public async Task<bool> DeleteAsync(Guid id)
	{
		var account = await _context.Accounts.FindAsync(id);
		if (account == null) return false;

		_context.Accounts.Remove(account);
		return await _context.SaveChangesAsync() > 0;
	}
}