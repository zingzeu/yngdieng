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
        public async override Task<ListWordListWordsResponse> ListWordListWords(ListWordListWordsRequest request,
                                                   ServerCallContext context)
        {
            return null;
        }
    }
}
