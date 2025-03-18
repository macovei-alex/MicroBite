using Microsoft.AspNetCore.Mvc;
using ResourceServer.Data;

namespace ResourceServer.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ProductController : ControllerBase
	{
		// TODO: Replace with repositories
		private readonly AppDbContext _context;


		public ProductController(AppDbContext context)
		{
			_context = context;
		}


		[HttpGet("/all")]
		public ActionResult<List<ProductController>> GetAll()
		{
			var products = _context.Products.ToList();
			return Ok(products);
		}
	}
}
