using Microsoft.AspNetCore.Authorization;
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

	[Authorize]
	[HttpGet("my-orders")]
	public ActionResult<IEnumerable<OrderGetDto>> GetUserOrders()
	{
		try
		{
			var jwtUser = JwtUser.GetFromPrincipal(User);
			var orders = _repository.GetUserOrders(jwtUser.Id);
			var ordersDto = orders.Select(o =>
			{
				return new OrderGetDto
				{
					Id = o.Id,
					AccountId = jwtUser.Id,
					Status = o.Status.Name,
					Address = o.Address,
					OrderTime = o.OrderTime,
					DeliveryTime = o.DeliveryTime,
					AdditionalNotes = o.AdditionalNotes,
					OrderItems = o.OrderItems
						.Where(oi => oi.Product != null)
						.Select(oi => new OrderGetDto.Item
						{
							ProductId = oi.Product!.Id,
							Quantity = oi.Count,
							TotalPrice = oi.TotalPrice
						})
						.ToList()
				};
			});
			return Ok(ordersDto);
		}
		catch (Exception ex)
		{
			return StatusCode(500, new { Message = "Eroare internă", Details = ex.Message });
		}

	}

	[HttpGet("{id}")]
	public ActionResult<Order> GetById(int id)
	{
		var order = _repository.GetById(id);
		return order != null ? Ok(order) : NotFound();
	}

	[HttpPost]
	[Authorize]
	public ActionResult<Order> Create([FromBody] OrderCreateDto order)
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
			return StatusCode(500, "Something went wrong");
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