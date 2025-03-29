using Microsoft.EntityFrameworkCore;
using ResourceServer.Data.DTO;
using ResourceServer.Data.Models;

namespace ResourceServer.Data.Repositories;

public class OrderItemRepository(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public IEnumerable<OrderItem> GetAll()
    {
        return [.. _context.OrderItems
            .Include(oi => oi.Product)
            .ThenInclude(oi=> oi.Category)
            .Include(oi => oi.Order)];
    }

    public OrderItem? GetById(int id)
    {
        return _context.OrderItems
            .Include(oi => oi.Product)
            .ThenInclude(oi=> oi.Category)
            .Include(oi => oi.Order)
            .FirstOrDefault(oi => oi.Id == id);
    }

    public OrderItemDto Add(OrderItemDto itemDto)
    {
        var product = _context.Products.Find(itemDto.ProductId);
        var order = _context.Orders.Find(itemDto.OrderId);

        if (product == null || order == null)
            throw new ArgumentException("Produsul sau comanda nu există");

        var orderItem = new OrderItem
        {
            Product = product,
            Order = order,
            Count = itemDto.Count,
            TotalPrice = itemDto.TotalPrice
        };

        _context.OrderItems.Add(orderItem);
        _context.SaveChanges();

        itemDto.Id = orderItem.Id;
        return itemDto;
    }

    public bool Update(int id, OrderItemDto updatedItemDto)
    {
        var existingItem = _context.OrderItems
            .Include(oi => oi.Product)
            .Include(oi => oi.Order)
            .FirstOrDefault(oi => oi.Id == id);

        if (existingItem == null) return false;

        var product = _context.Products.Find(updatedItemDto.ProductId);
        var order = _context.Orders.Find(updatedItemDto.OrderId);

        if (product == null || order == null)
            throw new ArgumentException("Produsul sau comanda nu există");

        existingItem.Product = product;
        existingItem.Order = order;
        existingItem.Count = updatedItemDto.Count;
        existingItem.TotalPrice = updatedItemDto.TotalPrice;

        _context.SaveChanges();
        return true;
    }

    public bool Delete(int id)
    {
        var item = _context.OrderItems.Find(id);
        if (item == null) return false;

        _context.OrderItems.Remove(item);
        _context.SaveChanges();
        return true;
    }
}