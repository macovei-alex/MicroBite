using AuthServer.Data.Models;

namespace AuthServer.Data.Repositories;

public class AccountRepository(AppDbContext context)
{
	private readonly AppDbContext _context = context;

	public List<Account> GetAll()
	{
		return _context.Accounts.ToList();
	}
}
