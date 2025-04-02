using ResourceServer.Data.DTO;
using ResourceServer.Data.Models;

namespace ResourceServer.Data.Repositories;

public interface IOrderRepository
{
	IEnumerable<Order> GetAll();
	Order? GetById(int id);
	Order Add(Order order);
	Order Add(CreateOrderDto orderDto, Guid accountId);
	bool Update(int id, Order updatedOrder);
	bool Delete(int id); //nu avem stergere in cascada , deci trebuie manuala.
}