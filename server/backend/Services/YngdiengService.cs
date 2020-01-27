using System;
using System.Threading.Tasks;
using Yngdieng.Protos;
using static Yngdieng.Protos.Query.Types;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Collections.Generic;
namespace Yngdieng.Backend.Services
{
  public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
  {
    private readonly ILogger<YngdiengService> _logger;
    private readonly IIndexHolder _indexHolder;

    public YngdiengService(ILogger<YngdiengService> logger, IIndexHolder indexHolder)
    {
      _logger = logger;
      _indexHolder = indexHolder;
    }

    public static string GetHanzi(Hanzi h)
    {
      return h.HanziCase == Hanzi.HanziOneofCase.Regular
                  ? h.Regular
                  : h.Ids;
    }

  }

  public static class StringExt
  {
    public static int CountOccurences(this string x, string query)
    {
      var count = 0;
      for (var i = 0; i < x.Length; ++i)
      {
        if (x[i..^0].StartsWith(query))
        {
          ++count;
        }
      }
      return count;
    }
  }
}
