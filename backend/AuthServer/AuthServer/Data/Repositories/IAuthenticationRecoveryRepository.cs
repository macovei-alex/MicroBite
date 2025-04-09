using AuthServer.Data.Models;

namespace AuthServer.Data.Repositories;

public interface IAuthenticationRecoveryRepository
{
    Task<AuthenticationRecovery?> GetByIdAsync(int id);
    Task<List<AuthenticationRecovery>> GetAllAsync();
    Task<AuthenticationRecovery> AddAsync(AuthenticationRecovery recovery);
    Task<bool> UpdateAsync(AuthenticationRecovery recovery);
    Task<bool> DeleteAsync(int id);
}