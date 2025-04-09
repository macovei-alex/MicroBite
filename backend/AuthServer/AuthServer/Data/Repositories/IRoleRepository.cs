using AuthServer.Data.Models;

namespace AuthServer.Data.Repositories;

public interface IRoleRepository
{
    Task<Role?> GetByIdAsync(int id);
    Task<Role?> GetByNameAsync(string name);
    Task<List<Role>> GetAllAsync();
    Task<Role> AddAsync(Role role);
    Task<bool> UpdateAsync(Role role);
    Task<bool> DeleteAsync(int id);
    bool Exists(string role);
}