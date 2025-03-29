using ResourceServer.Data.Models;

namespace ResourceServer.Data.Repositories;

public interface IOrderStatusRepository
{
    public IEnumerable<OrderStatus> GetAll();
    public OrderStatus? GetById(int id);
    public OrderStatus Add(OrderStatus status);
    public bool Update(int id, OrderStatus updatedStatus);
    public bool Delete(int id);
}