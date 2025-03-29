using ResourceServer.Data.Models;

namespace ResourceServer.Data.Repositories;

public interface IProductCategoryRepository
{
    public IEnumerable<ProductCategory> GetAll();
    public ProductCategory? GetById(int id);
    public ProductCategory Add(ProductCategory category);
    public bool Update(int id, ProductCategory category);
    public bool Delete(int id);
}