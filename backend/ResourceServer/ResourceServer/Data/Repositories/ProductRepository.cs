using Microsoft.EntityFrameworkCore;
using ResourceServer.Data.DTO;
using ResourceServer.Data.Models;
using System.Security.Cryptography.Xml;

namespace ResourceServer.Data.Repositories;

public class ProductRepository(AppDbContext context) : IProductRepository
{
	private readonly AppDbContext _context = context;

	public List<Product> GetAll()
	{
		return [.. _context.Products.Include(p => p.Category)];
	}

	public Product? GetById(int id)
	{
		return _context.Products
			.Include(p => p.Category)
			.FirstOrDefault(p => p.Id == id);
	}

	public Product Create(Product product)
	{
		var category = _context.ProductCategories.Find(product.Category.Id)
			?? throw new ArgumentException("Categoria nu există");
		product.Category = category;
		_context.Products.Add(product);
		_context.SaveChanges();
		return product;
	}

	public List<Product> CreateAll(List<ProductCreateDto> productsCreate)
	{
		var productNames = productsCreate
			.Select(p => p.Name)
			.ToHashSet();
		if (productNames.Count != productsCreate.Count)
		{
			throw new ArgumentException("Duplicate product names");
		}

		var categoriesDict = productsCreate
			.Select(p => _context.ProductCategories.FirstOrDefault(c => c.Id == p.CategoryId))
			.Where(c => c != null)
			.Distinct()
			.ToDictionary(c => c!.Id);

		var mappedProducts = productsCreate
			.Select(p => new Product
			{
				Name = p.Name,
				Price = p.Price,
				Description = p.Description,
				Image = p.Image,
				Category = categoriesDict[p.CategoryId]
					?? throw new ArgumentException($"Category ( {p.CategoryId} ) does not exist")
			})
			.ToList();
		var mappedProductNames = mappedProducts
			.Select(p => p.Name)
			.ToHashSet();

		var productsFound = _context.Products
			.Where(p => mappedProductNames.Contains(p.Name));

		if (productsFound.Any())
		{
			throw new ArgumentException($"One or more products with the same name already exist");
		}

		_context.Products.AddRange(mappedProducts);
		_context.SaveChanges();
		return _context.Products.Where(p => productNames.Contains(p.Name)).ToList();
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