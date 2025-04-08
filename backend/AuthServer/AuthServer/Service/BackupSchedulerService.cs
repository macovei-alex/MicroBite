namespace AuthServer.Service
{
    public class BackupSchedulerService : BackgroundService
    {
        private readonly IBackupService _backupService;
        private readonly ILogger<BackupSchedulerService> _logger;

        public BackupSchedulerService(IBackupService backupService, ILogger<BackupSchedulerService> logger)
        {
            _backupService = backupService;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await _backupService.CreateBackup();
                    await _backupService.CleanOldBackups(7); // Șterge backup-uri mai vechi de 7 zile
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Backup scheduling error");
                }

                await Task.Delay(TimeSpan.FromHours(24), stoppingToken); // Backup zilnic daca serverul ruleaza mai mult de 24 de ore
            }
        }
    }
}
