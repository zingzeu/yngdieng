using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using ZingzeuOrg.Yngdieng.Web.Db;
using AdminProtos = Yngdieng.Admin.V1.Protos;
namespace ZingzeuOrg.Yngdieng.Web.Services.Admin
{

    [Authorize("YngdiengAdminAccess")]
    public partial class AdminService : AdminProtos.AdminService.AdminServiceBase
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
