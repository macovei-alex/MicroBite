using Microsoft.AspNetCore.Mvc;
using ResourceServer.Data.Models;
using ResourceServer.Data.Repositories;

namespace ResourceServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductCategoryController(IProductCategoryRepository repository) : ControllerBase
{
    private readonly IProductCategoryRepository _repository = repository;

    [HttpGet]
    public ActionResult<IEnumerable<ProductCategory>> GetAll()
    {
        return Ok(_repository.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<ProductCategory> GetById(int id)
    {
        var category = _repository.GetById(id);
        return category != null ? Ok(category) : NotFound();
    }

    [HttpPost]
    public ActionResult<ProductCategory> Create([FromBody] ProductCategory category)
    {
        var created = _repository.Add(category);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] ProductCategory category)
    {
        return _repository.Update(id, category) ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        return _repository.Delete(id) ? NoContent() : NotFound();
    }
}