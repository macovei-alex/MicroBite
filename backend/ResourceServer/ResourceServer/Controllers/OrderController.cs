using Microsoft.AspNetCore.Mvc;
using ResourceServer.Data.Models;
using ResourceServer.Data.Repositories;

namespace ResourceServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrderController(IOrderRepository repository) : ControllerBase
{
    private readonly IOrderRepository _repository = repository;

    [HttpGet]
    public ActionResult<IEnumerable<Order>> GetAll()
    {
        return Ok(_repository.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<Order> GetById(int id)
    {
        var order = _repository.GetById(id);
        return order != null ? Ok(order) : NotFound();
    }

    [HttpPost]
    public ActionResult<Order> Create([FromBody] Order order)
    {
        var created = _repository.Add(order);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Order order)
    {
        return _repository.Update(id, order) ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        return _repository.Delete(id) ? NoContent() : NotFound();
    }
}