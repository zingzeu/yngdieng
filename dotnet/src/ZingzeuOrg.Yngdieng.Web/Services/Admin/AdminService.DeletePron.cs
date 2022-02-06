using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yngdieng.Admin.V1.Protos;
using ZingzeuOrg.Yngdieng.Web.Db;
using static ZingzeuOrg.Yngdieng.Web.Services.Admin.EnumConversions;
using AdminProtos = Yngdieng.Admin.V1.Protos;
namespace ZingzeuOrg.Yngdieng.Web.Services.Admin
{
    public partial class AdminService : AdminProtos.AdminService.AdminServiceBase
    {


        public async override Task<MyEmpty> DeletePron(DeletePronRequest request,
                                                   ServerCallContext context)
        {
            if (string.IsNullOrEmpty(request.Name))
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "parent name not be empty"));
            }
            var pronRef = ResourceNames.ToPronRef(request.Name);
            _dbContext.Remove(
               await _dbContext.Prons.Where(p => p.WordId == pronRef.WordId
                   && p.PronId == pronRef.PronId).SingleOrDefaultAsync()
           );
            await _dbContext.SaveChangesAsync();
            return new MyEmpty
            {
            };
        }
    }
}
