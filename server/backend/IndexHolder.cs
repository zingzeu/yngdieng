using System.IO;
using System;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Yngdieng.Protos;

namespace Yngdieng.Backend
{
  public interface IIndexHolder
  {
    YngdiengIndex GetIndex();
  }

  public sealed class IndexHolder : IIndexHolder
  {
    private readonly ILogger<IndexHolder> _logger;

    private YngdiengIndex index;

    public IndexHolder(IConfiguration config, ILogger<IndexHolder> logger)
    {
      var indexFilePath = config["IndexFile"];
      _logger = logger;

      _logger.LogInformation($"Loading index from {Path.GetFullPath(indexFilePath)}");

      using (var input = File.OpenRead(indexFilePath))
      {
        index = YngdiengIndex.Parser.ParseFrom(input);
      }

      _logger.LogInformation($"{index.Documents.Count} documents loaded.");
    }

    public YngdiengIndex GetIndex()
    {
      return index;
    }
  }
}
