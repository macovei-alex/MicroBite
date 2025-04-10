namespace AuthServer.UnitTests.Services;

[TestClass]
public class BackupSchedulerServiceTestsWithNSubstitute
{
    private IBackupService _mockBackupService;
    private ILogger<BackupSchedulerService> _mockLogger;
    private CancellationTokenSource _stoppingTokenSource;
    private CancellationToken _stoppingToken;

    [TestInitialize]
    public void TestInitialize()
    {
        _mockBackupService = Substitute.For<IBackupService>();
        _mockLogger = Substitute.For<ILogger<BackupSchedulerService>>();
        _stoppingTokenSource = new CancellationTokenSource();
        _stoppingToken = _stoppingTokenSource.Token;
    }

    [TestMethod]
    public async Task ExecuteAsync_CallsBackupAndCleanupOnSchedule()
    {
        var schedulerService = new BackupSchedulerService(_mockBackupService, _mockLogger);
        var task = schedulerService.StartAsync(_stoppingToken);
        await Task.Delay(TimeSpan.FromMilliseconds(500));
        _stoppingTokenSource.Cancel();

        try
        {
            await task;
        }
        catch (TaskCanceledException)
        {
        }

        await _mockBackupService.Received(1).CreateBackup();
        await _mockBackupService.Received(1).CleanOldBackups(7);
    }

    [TestMethod]
    public async Task ExecuteAsync_LogsErrorWhenBackupFails()
    {
        var schedulerService = new BackupSchedulerService(_mockBackupService, _mockLogger);
        var backupException = new Exception("Backup failed");
        _mockBackupService.CreateBackup().ThrowsAsync(backupException);
        var task = schedulerService.StartAsync(_stoppingToken);
        await Task.Delay(TimeSpan.FromMilliseconds(100));
        _stoppingTokenSource.Cancel();

        try
        {
            await task;
        }
        catch (TaskCanceledException)
        {
        }

        await _mockBackupService.Received(1).CreateBackup();
        await _mockBackupService.DidNotReceive().CleanOldBackups(7);
        _mockLogger.Received(1).LogError(backupException, "Backup scheduling error");
    }

    [TestMethod]
    public async Task ExecuteAsync_LogsErrorWhenCleanupFails()
    {
        var schedulerService = new BackupSchedulerService(_mockBackupService, _mockLogger);
        var cleanupException = new Exception("Cleanup failed");
        _mockBackupService.CleanOldBackups(7).ThrowsAsync(cleanupException);
        var task = schedulerService.StartAsync(_stoppingToken);
        await Task.Delay(TimeSpan.FromMilliseconds(100));
        _stoppingTokenSource.Cancel();

        try
        {
            await task;
        }
        catch (TaskCanceledException)
        {
        }

        await _mockBackupService.Received(1).CreateBackup();
        await _mockBackupService.Received(1).CleanOldBackups(7);
        _mockLogger.Received(1).LogError(cleanupException, "Backup scheduling error");
    }
}