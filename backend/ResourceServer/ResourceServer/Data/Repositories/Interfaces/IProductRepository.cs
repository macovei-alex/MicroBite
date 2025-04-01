using ResourceServer.Data.DTO;
using ResourceServer.Data.Models;

namespace ResourceServer.Data.Repositories;

public interface IProductRepository
{
	public List<Product> GetAll();
	public Product? GetById(int id);
	public Product Create(Product product);
	public List<Product> CreateAll(List<ProductCreateDto> products);
	public bool Update(int id, Product updatedProduct);
	public bool Delete(int id);
}