using Microsoft.Extensions.Logging;
using ZingzeuOrg.Yngdieng.Web.Db;
using Yngdieng.OpenCC;
using FrontendProtos = Yngdieng.Frontend.V3.Protos;

namespace ZingzeuOrg.Yngdieng.Web.Services.Frontend
{

    public partial class FrontendService : FrontendProtos.FrontendService.FrontendServiceBase
    {
        private readonly ILogger<FrontendService> _logger;
        private readonly IIndexHolder _indexHolder;
        private readonly AdminContext _dbContext;
        private readonly YngdiengOpenCcClient _openCc;

        public FrontendService(
            ILogger<FrontendService> logger,
            IIndexHolder indexHolder,
            AdminContext dbContext,
            YngdiengOpenCcClient openCc)
        {
            _logger = logger;
            _indexHolder = indexHolder;
            _dbContext = dbContext;
            _openCc = openCc;
        }

    }
}
