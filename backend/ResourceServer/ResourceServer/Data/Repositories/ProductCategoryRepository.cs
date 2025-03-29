using ResourceServer.Data.Models;

namespace ResourceServer.Data.Repositories;

public class ProductCategoryRepository(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public IEnumerable<ProductCategory> GetAll()
    {
        return [.. _context.ProductCategories];
    }

    public ProductCategory? GetById(int id)
    {
        return _context.ProductCategories.Find(id);
    }

    public ProductCategory Add(ProductCategory category)
    {
        _context.ProductCategories.Add(category);
        _context.SaveChanges();
        return category;
    }

    public bool Update(int id, ProductCategory category)
    {
        var existing = _context.ProductCategories.Find(id);
        if (existing == null) return false;

        existing.Name = category.Name;
        _context.SaveChanges();
        return true;
    }

    public bool Delete(int id)
    {
        var category = _context.ProductCategories.Find(id);
        if (category == null) return false;

        _context.ProductCategories.Remove(category);
        _context.SaveChanges();
        return true;
    }
}
