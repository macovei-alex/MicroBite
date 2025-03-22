using Microsoft.EntityFrameworkCore;
using AuthServer.Data.Models;

namespace AuthServer.Data.Repositories;

public class AuthenticationRecoveryRepository(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public async Task<AuthenticationRecovery?> GetByIdAsync(int id)
    {
        return await _context.AuthenticationRecoveries.FindAsync(id);
    }

    public async Task<List<AuthenticationRecovery>> GetAllAsync()
    {
        return await _context.AuthenticationRecoveries.ToListAsync();
    }

    public async Task<AuthenticationRecovery> AddAsync(AuthenticationRecovery recovery)
    {
        _context.AuthenticationRecoveries.Add(recovery);
        await _context.SaveChangesAsync();
        return recovery;
    }

    public async Task<bool> UpdateAsync(AuthenticationRecovery recovery)
    {
        _context.Entry(recovery).State = EntityState.Modified;
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var recovery = await _context.AuthenticationRecoveries.FindAsync(id);
        if (recovery == null) return false;

        _context.AuthenticationRecoveries.Remove(recovery);
        return await _context.SaveChangesAsync() > 0;
    }
}