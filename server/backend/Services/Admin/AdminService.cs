using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Yngdieng.Backend.Db;

namespace Yngdieng.Backend.Services.Admin
{

    [Authorize("YngdiengAdminAccess")]
    public partial class AdminService : Yngdieng.Admin.V1.Protos.AdminService.AdminServiceBase
    {
        private readonly ILogger<AdminService> _logger;
        private readonly AdminContext _dbContext;
        public AdminService(ILogger<AdminService> logger, AdminContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

    }
}
