using Microsoft.EntityFrameworkCore;
using ResourceServer.Data.Models;

namespace ResourceServer.Data.Repositories;

public class OrderStatusRepository(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public IEnumerable<OrderStatus> GetAll()
    {
        return _context.OrderStatuses.ToList();
    }

    public OrderStatus? GetById(int id)
    {
        return _context.OrderStatuses.Find(id);
    }

    public OrderStatus Add(OrderStatus status)
    {
        _context.OrderStatuses.Add(status);
        _context.SaveChanges();
        return status;
    }

    public bool Update(int id, OrderStatus updatedStatus)
    {
        var existingStatus = _context.OrderStatuses.Find(id);
        if (existingStatus == null) return false;

        existingStatus.Name = updatedStatus.Name;
        _context.SaveChanges();
        return true;
    }

    public bool Delete(int id)
    {
        var status = _context.OrderStatuses.Find(id);
        if (status == null) return false;

        _context.OrderStatuses.Remove(status);
        _context.SaveChanges();
        return true;
    }
}