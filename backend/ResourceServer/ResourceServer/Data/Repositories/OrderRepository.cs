using Microsoft.EntityFrameworkCore;
using ResourceServer.Data.Models;

namespace ResourceServer.Data.Repositories;

public class OrderRepository(AppDbContext context) : IOrderRepository
{
    private readonly AppDbContext _context = context;

    public IEnumerable<Order> GetAll()
    {
        return [.. _context.Orders
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .ThenInclude(oi => oi.Category)];
    }

    public Order? GetById(int id)
    {
        return _context.Orders
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .ThenInclude(oi=> oi.Category)
            .FirstOrDefault(o => o.Id == id);
    }

    public Order Add(Order order)
    {
        var status = _context.OrderStatuses.Find(order.Status.Id) ?? throw new ArgumentException("Statusul comenzii nu există");
        order.Status = status;

        foreach (var item in order.OrderItems)
        {
            var existingProduct = _context.Products
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == item.Product.Id);

            if (existingProduct != null)
            {
                item.Product = existingProduct;
            }
            else
            {
                var existingCategory = _context.ProductCategories.Find(item.Product.Category.Id);
                if (existingCategory != null)
                    item.Product.Category = existingCategory;
            }
        }

        _context.Orders.Add(order);
        _context.SaveChanges();
        return order;
    }


    public bool Update(int id, Order updatedOrder)
    {
        var existingOrder = _context.Orders
            .Include(o => o.Status)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefault(o => o.Id == id);

        if (existingOrder == null) return false;

        var status = _context.OrderStatuses.Find(updatedOrder.Status.Id) ?? throw new ArgumentException("Statusul comenzii nu există");
        existingOrder.Status = status;
        existingOrder.AccountId = updatedOrder.AccountId;
        existingOrder.Address = updatedOrder.Address;
        existingOrder.OrderTime = updatedOrder.OrderTime;
        existingOrder.DeliveryTime = updatedOrder.DeliveryTime;
        existingOrder.AdditionalNotes = updatedOrder.AdditionalNotes;

        var newItemIds = updatedOrder.OrderItems.Select(oi => oi.Id).ToList();
        existingOrder.OrderItems.RemoveAll(oi => !newItemIds.Contains(oi.Id));

        foreach (var updatedItem in updatedOrder.OrderItems)
        {
            var existingItem = existingOrder.OrderItems.FirstOrDefault(oi => oi.Id == updatedItem.Id);

            if (existingItem != null)
            {
                existingItem.Count = updatedItem.Count;
                existingItem.TotalPrice = updatedItem.TotalPrice;

                var existingProduct = _context.Products.Find(updatedItem.Product.Id);
                if (existingProduct != null)
                    existingItem.Product.Price = updatedItem.Product.Price;
            }
            else
            {
                var newProduct = _context.Products.Find(updatedItem.Product.Id) ?? throw new ArgumentException($"Produsul cu ID {updatedItem.Product.Id} nu există");
                updatedItem.Product = newProduct;
                existingOrder.OrderItems.Add(updatedItem);
            }
        }

        _context.SaveChanges();
        return true;
    }


    public bool Delete(int id) //nu avem stergere in cascada , deci trebuie manuala.
    {
        var order = _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefault(o => o.Id == id);

        if (order == null) return false;

        _context.OrderItems.RemoveRange(order.OrderItems);

        _context.Orders.Remove(order);
        _context.SaveChanges();
        return true;
    }
}