using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Yngdieng.Backend.HealthChecks;
using Yngdieng.Protos;

namespace Yngdieng.Backend
{

  public sealed class IndexLoaderBackgroundService : BackgroundService
  {
    private readonly IConfiguration config;
    private readonly ILogger<IndexLoaderBackgroundService> logger;
    private readonly IIndexHolder indexHolder;
    private readonly IndexHealthCheck indexHealthCheck;

    public IndexLoaderBackgroundService(IConfiguration config,
                                        ILogger<IndexLoaderBackgroundService> logger,
                                        IIndexHolder indexHolder,
                                        IndexHealthCheck indexHealthCheck)
    {
      this.config = config;
      this.logger = logger;
      this.indexHolder = indexHolder;
      this.indexHealthCheck = indexHealthCheck;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
      var indexFilePath = config["IndexFile"];
      logger.LogInformation($"Loading index from {Path.GetFullPath(indexFilePath)}");

      using (var input = File.OpenRead(indexFilePath))
      {
        var index = YngdiengIndex.Parser.ParseFrom(input);
        indexHolder.StoreIndex(index);
        indexHealthCheck.IndexLoaded = true;
        logger.LogInformation(
            $"{index.HistoricalDocuments.Count} + {index.FengDocuments.Count} documents loaded.");
      }
      return Task.CompletedTask;
    }
  }
}
