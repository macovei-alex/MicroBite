using Microsoft.AspNetCore.Mvc;
using ResourceServer.Data.Models;
using ResourceServer.Data.Repositories;

namespace ResourceServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductController(ProductRepository productRepository) : ControllerBase
{
    private readonly ProductRepository _productRepository = productRepository;

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
    public IActionResult Update(int id, [FromBody] Product product)
    {
        return _productRepository.Update(id, product)
            ? NoContent()
            : NotFound();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        return _productRepository.Delete(id)
            ? NoContent()
            : NotFound();
    }
}