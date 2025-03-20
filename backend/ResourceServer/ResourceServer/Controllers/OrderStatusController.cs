using Microsoft.AspNetCore.Mvc;
using ResourceServer.Data.Models;
using ResourceServer.Data.Repositories;

namespace ResourceServer.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrderStatusController(OrderStatusRepository repository) : ControllerBase
{
    private readonly OrderStatusRepository _repository = repository;

    [HttpGet]
    public ActionResult<IEnumerable<OrderStatus>> GetAll()
    {
        return Ok(_repository.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<OrderStatus> GetById(int id)
    {
        var status = _repository.GetById(id);
        return status != null ? Ok(status) : NotFound();
    }

    [HttpPost]
    public ActionResult<OrderStatus> Create([FromBody] OrderStatus status)
    {
        var created = _repository.Add(status);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] OrderStatus status)
    {
        return _repository.Update(id, status) ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        return _repository.Delete(id) ? NoContent() : NotFound();
    }
}