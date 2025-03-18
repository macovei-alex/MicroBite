using Microsoft.AspNetCore.Mvc;
using ResourceServer.Data;
using ResourceServer.Data.Models;
using ResourceServer.Data.ProductRepository;

namespace ResourceServer.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ProductController : ControllerBase
	{
		private readonly ProductRepository _productRepository;


		public ProductController(ProductRepository productRepository)
		{
			_productRepository = productRepository;
		}


		[HttpGet("/all")]
		public ActionResult<List<Product>> GetAll()
		{
			var products = _productRepository.GetAll();
			return Ok(products);
		}
	}
}
