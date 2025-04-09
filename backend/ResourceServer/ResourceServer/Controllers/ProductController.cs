using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceServer.Data.DTO;
using ResourceServer.Data.Models;
using ResourceServer.Data.Repositories;
using ResourceServer.Data.Security;

namespace ResourceServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductController(IProductRepository productRepository) : ControllerBase
{
	private readonly IProductRepository _productRepository = productRepository;

	[HttpGet]
	public ActionResult<List<Product>> GetAll()
	{
		return Ok(_productRepository.GetAll());
	}

	[HttpGet("{id}")]
	public ActionResult<Product> GetById(int id)
	{
		var product = _productRepository.GetById(id);
		return product != null ? Ok(product) : NotFound();
	}

	[HttpPost]
	[Authorize(Roles = Role.Admin)]
	public ActionResult<Product> Create([FromBody] Product product)
	{
		try
		{
			var createdProduct = _productRepository.Create(product);
			return CreatedAtAction(nameof(GetById), new { id = createdProduct.Id }, createdProduct);
		}
		catch (ArgumentException ex)
		{
			return BadRequest(ex.Message);
		}
	}

	[HttpPut("{id}")]
	[Authorize(Roles = Role.Admin)]
	public IActionResult Update(int id, [FromBody] Product product)
	{
		return _productRepository.Update(id, product)
			? NoContent()
			: NotFound();
	}

	[HttpDelete("{id}")]
	[Authorize(Roles = Role.Admin)]
	public IActionResult Delete(int id)
	{
		return _productRepository.Delete(id)
			? NoContent()
			: NotFound();
	}

	[HttpPost("all")]
	[Authorize(Roles = Role.Admin)]
	public ActionResult<Product> CreateAll([FromBody] List<ProductCreateDto> products)
	{
		if (products.Count == 0)
		{
			return BadRequest("No products to create");
		}

		try
		{
			var createdProducts = _productRepository.CreateAll(products);
			return CreatedAtAction(nameof(GetById), new { id = createdProducts[0].Id }, createdProducts);
		}
		catch (ArgumentException ex)
		{
			return BadRequest(ex.Message);
		}
	}
}