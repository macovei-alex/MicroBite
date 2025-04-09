namespace AuthServer.Service;

public class BackupSchedulerService(IBackupService backupService, ILogger<BackupSchedulerService> logger) : BackgroundService
{
    private readonly IBackupService _backupService = backupService;
    private readonly ILogger<BackupSchedulerService> _logger = logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await _backupService.CreateBackup();
                await _backupService.CleanOldBackups(7);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Backup scheduling error");
            }

            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}