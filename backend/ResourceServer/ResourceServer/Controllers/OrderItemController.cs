using Microsoft.AspNetCore.Mvc;
using ResourceServer.Data.Models;
using ResourceServer.Data.DTO;
using ResourceServer.Data.Repositories;

namespace ResourceServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrderItemController(IOrderItemRepository repository) : ControllerBase
{
    private readonly IOrderItemRepository _repository = repository;

    [HttpGet]
    public ActionResult<IEnumerable<OrderItem>> GetAll()
    {
        return Ok(_repository.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<OrderItem> GetById(int id)
    {
        var item = _repository.GetById(id);
        return item != null ? Ok(item) : NotFound();
    }

    [HttpPost]
    public ActionResult<OrderItem> Create([FromBody] OrderItemDto item)
    {
        var created = _repository.Add(item);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] OrderItemDto item)
    {
        return _repository.Update(id, item) ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        return _repository.Delete(id) ? NoContent() : NotFound();
    }
}