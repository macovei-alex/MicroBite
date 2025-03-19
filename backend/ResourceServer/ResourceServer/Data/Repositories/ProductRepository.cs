using ResourceServer.Data.Models;

namespace ResourceServer.Data.Repositories;

public class ProductRepository(AppDbContext context)
{
	private readonly AppDbContext _context = context;

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