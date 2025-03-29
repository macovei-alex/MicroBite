using ResourceServer.Data.DTO;
using ResourceServer.Data.Models;

namespace ResourceServer.Data.Repositories;

public interface IOrderItemRepository
{
    IEnumerable<OrderItem> GetAll();
    OrderItem? GetById(int id);
    OrderItemDto Add(OrderItemDto itemDto);
    bool Update(int id, OrderItemDto updatedItemDto);
    bool Delete(int id);
}