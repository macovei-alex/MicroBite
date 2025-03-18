using Microsoft.AspNetCore.Mvc;
using ResourceServer.Data.Models;
using ResourceServer.Data.Repositories;

namespace ResourceServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductController(ProductRepository productRepository) : ControllerBase
{
	private readonly ProductRepository _productRepository = productRepository;

	[HttpGet("/all")]
	public ActionResult<List<Product>> GetAll()
	{
		var products = _productRepository.GetAll();
		return Ok(products);
	}
}