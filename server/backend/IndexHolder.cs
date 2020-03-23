using System.IO;
using System;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Yngdieng.Protos;
using Yngdieng.Backend.HealthChecks;

namespace Yngdieng.Backend
{
  public interface IIndexHolder
  {
    YngdiengIndex GetIndex();
  }

  public sealed class IndexHolder : IIndexHolder
  {
    private readonly ILogger<IndexHolder> _logger;
    private readonly IndexHealthCheck _indexHealthCheck;
    private YngdiengIndex index;

    public IndexHolder(IConfiguration config,
                       ILogger<IndexHolder> logger,
                       IndexHealthCheck indexHealthCheck)
    {
      var indexFilePath = config["IndexFile"];
      _logger = logger;
      this._indexHealthCheck = indexHealthCheck;
      _logger.LogInformation($"Loading index from {Path.GetFullPath(indexFilePath)}");

      using (var input = File.OpenRead(indexFilePath))
      {
        index = YngdiengIndex.Parser.ParseFrom(input);
      }

      _indexHealthCheck.IndexLoaded = true;
      _logger.LogInformation($"{index.Documents.Count} documents loaded.");
    }

    public YngdiengIndex GetIndex()
    {
      return index;
    }
  }
}
