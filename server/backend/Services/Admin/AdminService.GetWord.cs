using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yngdieng.Admin.V1.Protos;
using Yngdieng.Backend.Db;

namespace Yngdieng.Backend.Services.Admin
{
    public partial class AdminService : Yngdieng.Admin.V1.Protos.AdminService.AdminServiceBase
    {
        public async override Task<Yngdieng.Admin.V1.Protos.Word> GetWord(GetWordRequest request,
                                                   ServerCallContext context)
        {

            if (string.IsNullOrEmpty(request.Name))
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "name must not be empty"));
            }
            var wordRef = ResourceNames.ToWordRef(request.Name);

            return Renderers.ToWord(
                await _dbContext.Words.Where(w => w.WordId == wordRef.WordId).SingleAsync(),
                await _dbContext.Prons.Where(p => p.WordId == wordRef.WordId)
                    .Select(p => new PronRef { WordId = wordRef.WordId, PronId = p.PronId })
                    .ToListAsync()
            );
        }
    }
}
