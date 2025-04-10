using Npgsql;
using System.Diagnostics;

namespace AuthServer.Service;

public interface IBackupService
{
	Task<string> CreateBackup();
	Task CleanOldBackups(int daysToKeep);
}

public class PostgresAuthBackupService : IBackupService
{
	private readonly IConfiguration _config;
	private readonly ILogger<PostgresAuthBackupService> _logger;
	private readonly string _backupDir = Path.Combine(Directory.GetCurrentDirectory(), "auth_backups");

	public PostgresAuthBackupService(IConfiguration config, ILogger<PostgresAuthBackupService> logger)
	{
		_config = config;
		_logger = logger;
		Directory.CreateDirectory(_backupDir);
	}

	public async Task<string> CreateBackup()
	{
		var connectionString = _config.GetConnectionString("AuthDb");
		var builder = new NpgsqlConnectionStringBuilder(connectionString);

		var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
		var backupFile = Path.Combine(_backupDir, $"auth_backup_{timestamp}.dump");

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
			using var process = Process.Start(processInfo)
				?? throw new Exception("Failed to create the database backup process");
			string error = await process.StandardError.ReadToEndAsync();
			await process.WaitForExitAsync();

			if (process.ExitCode != 0)
			{
				_logger.LogError("Auth backup failed: {Error}", error);
				throw new Exception($"Auth backup failed: {error}");
			}

			_logger.LogInformation("Auth backup created: {BackupFile}", backupFile);
			return backupFile;
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Auth backup error");
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
				_logger.LogInformation("Deleted old auth backup: {File}", file);
			}
		}
		return Task.CompletedTask;
	}
}
