using System.Threading.Tasks;
using Yngdieng.Protos;
using Grpc.Core;
using System.Linq;
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
