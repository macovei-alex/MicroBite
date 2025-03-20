using AuthServer.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthServer.Data.Repositories;

public class AccountRepository(AppDbContext context)
{
	private readonly AppDbContext _context = context;

	public List<Account> GetAll()
	{
		return _context.Accounts.ToList();
	}

	public Account GetById(int id)
    {
        return _context.Accounts.Find(id);
    }
}
