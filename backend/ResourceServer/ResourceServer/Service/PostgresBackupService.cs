using Npgsql;
using System.Diagnostics;

namespace ResourceServer.Service
{
    public interface IBackupService
    {
        Task<string> CreateBackup();
        Task CleanOldBackups(int daysToKeep);
    }

    public class PostgresBackupService : IBackupService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<PostgresBackupService> _logger;
        private readonly string _backupDir = Path.Combine(Directory.GetCurrentDirectory(), "backups");

        public PostgresBackupService(IConfiguration config, ILogger<PostgresBackupService> logger)
        {
            _config = config;
            _logger = logger;
            Directory.CreateDirectory(_backupDir);
        }

        public async Task<string> CreateBackup()
        {
            var connectionString = _config.GetConnectionString("ResourceDb");
            var builder = new NpgsqlConnectionStringBuilder(connectionString);

            var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            var backupFile = Path.Combine(_backupDir, $"backup_{timestamp}.sql");

            var processInfo = new ProcessStartInfo
            {
                FileName = "pg_dump",
                Arguments = $"-h {builder.Host} -p {builder.Port} -U {builder.Username} -d {builder.Database} -Fc -f {backupFile}",
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            processInfo.Environment["PGPASSWORD"] = builder.Password;

            try
            {
                using var process = Process.Start(processInfo);
                string error = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();

                if (process.ExitCode != 0)
                {
                    _logger.LogError("Backup failed: {Error}", error);
                    throw new Exception($"Backup failed: {error}");
                }

                _logger.LogInformation("Backup created: {BackupFile}", backupFile);
                return backupFile;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Backup error");
                throw;
            }
        }

        public Task CleanOldBackups(int daysToKeep)
        {
            var cutoff = DateTime.Now.AddDays(-daysToKeep);
            foreach (var file in Directory.GetFiles(_backupDir))
            {
                if (File.GetLastWriteTime(file) < cutoff)
                {
                    File.Delete(file);
                    _logger.LogInformation("Deleted old backup: {File}", file);
                }
            }
            return Task.CompletedTask;
        }
    }
}
