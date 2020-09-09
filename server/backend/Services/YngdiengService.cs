using Yngdieng.Protos;
using Microsoft.Extensions.Logging;
using System;

namespace Yngdieng.Backend.Services
{
  public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
  {
    private readonly ILogger<YngdiengService> _logger;
    private readonly IIndexHolder _indexHolder;
    private readonly ISearchCache _cache;
    public YngdiengService(ILogger<YngdiengService> logger, IIndexHolder indexHolder, ISearchCache cache)
    {
      _logger = logger;
      _indexHolder = indexHolder;
      _cache = cache;
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

    public static string Truncate(this string value, int maxLength)
    {
      if (string.IsNullOrEmpty(value)) { return value; }

      if (value.Length > maxLength) {
        return value.Substring(0, maxLength-3)+"...";
      }
      return value;
    }

    public static string OrElse(this string value, string alt) {
      if (string.IsNullOrEmpty(value)) {
        return alt;
      }
      return value;
    }
  }
}
