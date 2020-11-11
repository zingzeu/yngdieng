using Microsoft.Extensions.Logging;
using Yngdieng.Backend.Db;
using Yngdieng.OpenCC;

namespace Yngdieng.Backend.Services.Frontend
{

    public partial class FrontendService : Yngdieng.Frontend.V3.Protos.FrontendService.FrontendServiceBase
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
