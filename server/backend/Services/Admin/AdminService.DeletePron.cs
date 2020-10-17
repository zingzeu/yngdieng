using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yngdieng.Admin.V1.Protos;
using Yngdieng.Backend.Db;
using static Yngdieng.Backend.Services.Admin.EnumConversions;
namespace Yngdieng.Backend.Services.Admin
{
    public partial class AdminService : Yngdieng.Admin.V1.Protos.AdminService.AdminServiceBase
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
