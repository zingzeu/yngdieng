using System;
using Microsoft.Extensions.Logging;
using Yngdieng.OpenCC;
using YngdiengProtos = Yngdieng.Protos;

namespace ZingzeuOrg.Yngdieng.Web.Services
{
    public partial class YngdiengService : YngdiengProtos.YngdiengService.YngdiengServiceBase
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

        public static string GetHanzi(YngdiengProtos.Hanzi h)
        {
            return h.HanziCase == YngdiengProtos.Hanzi.HanziOneofCase.Regular
                        ? h.Regular
                        : h.Ids;
        }

    }

}
