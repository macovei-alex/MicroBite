using Microsoft.EntityFrameworkCore;
using ResourceServer.Data.Models;

namespace ResourceServer.Data.Repositories;

public class ProductRepository(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public List<Product> GetAll()
    {
        return _context.Products
            .Include(p => p.Category)
            .ToList();
    }

    public Product? GetById(int id)
    {
        return _context.Products
            .Include(p => p.Category)
            .FirstOrDefault(p => p.Id == id);
    }

    public Product Create(Product product)
    {
        var category = _context.ProductCategories.Find(product.Category.Id);
        if (category == null) throw new ArgumentException("Categoria nu există");

        product.Category = category;
        _context.Products.Add(product);
        _context.SaveChanges();
        return product;
    }

    public bool Update(int id, Product updatedProduct)
    {
        var existingProduct = _context.Products
            .Include(p => p.Category)
            .FirstOrDefault(p => p.Id == id);

        if (existingProduct == null) return false;

        var newCategory = _context.ProductCategories
            .Find(updatedProduct.Category.Id);

        if (newCategory == null) return false;

        existingProduct.Category = newCategory;
        existingProduct.Name = updatedProduct.Name;
        existingProduct.Price = updatedProduct.Price;
        existingProduct.Description = updatedProduct.Description;
        existingProduct.Image = updatedProduct.Image;

        _context.SaveChanges();
        return true;
    }

    public bool Delete(int id)
    {
        var product = _context.Products.Find(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        _context.SaveChanges();
        return true;
    }
}