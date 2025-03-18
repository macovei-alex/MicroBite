using ResourceServer.Data.Models;

namespace ResourceServer.Data.ProductRepository
{
	public class ProductRepository
	{
		private readonly AppDbContext _context;


		public ProductRepository(AppDbContext context)
		{
			_context = context;
		}

		// examples
		public List<Product> GetAll()
		{
			return _context.Products.ToList();
		}

		public Product? GetById(int id)
		{
			return _context.Products.FirstOrDefault(p => p.Id == id);
		}

		// TODO: Implement repository methods
	}
}
