using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yngdieng.Backend.Db;
using Yngdieng.Frontend.V3.Protos;

namespace Yngdieng.Backend.Services.Frontend
{

    public partial class FrontendService : Yngdieng.Frontend.V3.Protos.FrontendService.FrontendServiceBase
    {
        public async override Task<Yngdieng.Frontend.V3.Protos.WordList> GetWordList(GetWordListRequest request,
                                                   ServerCallContext context)
        {
            if (string.IsNullOrEmpty(request.Name))
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "name must not be empty"));
            }
            var wordListId = ResourceNames.ToWordListId(request.Name);
            return Renderers.ToWordList(await _dbContext.WordLists.Where(w => w.WordListId == wordListId).SingleAsync());
        }
    }
}
