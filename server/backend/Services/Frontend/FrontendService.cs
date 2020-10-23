using Microsoft.Extensions.Logging;
using Yngdieng.Backend.Db;

namespace Yngdieng.Backend.Services.Frontend
{

    public partial class FrontendService : Yngdieng.Frontend.V1.Protos.FrontendService.FrontendServiceBase
    {
        private readonly ILogger<FrontendService> _logger;
        private readonly IIndexHolder _indexHolder;
        private readonly AdminContext _dbContext;
        public FrontendService(ILogger<FrontendService> logger, IIndexHolder indexHolder, AdminContext dbContext)
        {
            _logger = logger;
            _indexHolder = indexHolder;
            _dbContext = dbContext;
        }

    }
}
