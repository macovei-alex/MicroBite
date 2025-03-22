﻿using AuthServer.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthServer.Data.Repositories
{
    public class RoleRepository(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public async Task<Role?> GetByIdAsync(int id)
        {
            return await _context.Roles.FindAsync(id);
        }

        public async Task<List<Role>> GetAllAsync()
        {
            return await _context.Roles.ToListAsync();
        }

        public async Task<Role> AddAsync(Role role)
        {
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            return role;
        }

        public async Task<bool> UpdateAsync(Role role)
        {
            _context.Entry(role).State = EntityState.Modified;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null) return false;

            _context.Roles.Remove(role);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
