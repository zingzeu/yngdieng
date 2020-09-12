using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Yngdieng.Protos;
namespace Yngdieng.Backend.Services
{
    public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
    {

        public override Task<DebugInfo> GetDebugInfo(GetDebugInfoRequest request,
                                                     ServerCallContext context)
        {
            return Task.FromResult(new DebugInfo { IndexVersion = _indexHolder.GetIndex().Version });
        }
    }
}
