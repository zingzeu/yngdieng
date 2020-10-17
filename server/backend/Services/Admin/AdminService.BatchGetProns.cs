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


        public async override Task<BatchGetPronsResponse> BatchGetProns(BatchGetPronsRequest request,
                                                   ServerCallContext context)
        {
            if (string.IsNullOrEmpty(request.Parent))
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "parent must not be empty"));
            }
            var wordRef = ResourceNames.ToWordRef(request.Parent);
            return new BatchGetPronsResponse
            {
                Prons = {
                    request.Names.Select(x=>ResourceNames.ToPronRef(x))
                    .SelectMany(pRef => _dbContext.Prons.Where(pron =>pron.WordId == pRef.WordId &&
                    pron.PronId == pRef.PronId))
                    .Select(dbP => Renderers.ToPron(dbP))}
            };
        }
    }
}
