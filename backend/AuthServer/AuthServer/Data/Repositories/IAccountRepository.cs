using AuthServer.Data.Models;

namespace AuthServer.Data.Repositories;

public interface IAccountRepository
{
    Task<Account?> GetByIdAsync(Guid id);
    Task<Account?> GetByEmailAsync(string email);
    Task<Account?> GetByEmailOrPhoneAsync(string email, string phoneNumber);
    Account? GetByRefreshToken(string refreshToken);
    Task<List<Account>> GetAllAsync();
    Task<Account> AddAsync(Account account);
    Task<bool> UpdateAsync(Account account);
    Task<bool> DeleteAsync(Guid id);
}