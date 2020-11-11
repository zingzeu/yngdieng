using System;
using Microsoft.Extensions.Logging;
using Yngdieng.OpenCC;
using Yngdieng.Protos;

namespace Yngdieng.Backend.Services
{
    public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
    {
        private readonly ILogger<YngdiengService> _logger;
        private readonly IIndexHolder _indexHolder;
        private readonly ISearchCache _cache;
        private readonly YngdiengOpenCcClient _openCc;

        public YngdiengService(
            ILogger<YngdiengService> logger,
            IIndexHolder indexHolder,
            ISearchCache cache,
            YngdiengOpenCcClient openCc)
        {
            _logger = logger;
            _indexHolder = indexHolder;
            _cache = cache;
            _openCc = openCc;
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

            if (value.Length > maxLength)
            {
                return value.Substring(0, maxLength - 3) + "...";
            }
            return value;
        }

        public static string OrElse(this string value, string alt)
        {
            if (string.IsNullOrEmpty(value))
            {
                return alt;
            }
            return value;
        }
    }
}
