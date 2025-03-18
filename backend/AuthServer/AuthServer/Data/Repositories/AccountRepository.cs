namespace AuthServer.Data.Repositories
{
	public class AccountRepository
	{
		private readonly AppDbContext _context;

		public AccountRepository(AppDbContext context)
		{
			_context = context;
		}
	}
}
