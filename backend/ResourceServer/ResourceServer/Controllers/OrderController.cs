using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ResourceServer.Data.DTO;
using ResourceServer.Data.Models;
using ResourceServer.Data.Repositories;
using ResourceServer.Data.Security;

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
	[Authorize]
	public ActionResult<Order> Create([FromBody] CreateOrderDto order)
	{
		try
		{
			var jwtUser = JwtUser.GetFromPrincipal(User);
			var created = _repository.Add(order, jwtUser.Id);
			return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
		}
		catch (ArgumentException ex)
		{
			return BadRequest(ex.Message);
		}
		catch (Exception ex)
		{
			Console.WriteLine(ex);
			return StatusCode(500, "Something went wrong");
		}
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