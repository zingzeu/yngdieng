using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Yngdieng.Protos;

namespace ZingzeuOrg.Yngdieng.Web.Services
{
    public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
    {

        public override Task<SimplifyTextResponse> SimplifyText(SimplifyTextRequest request,
                                                     ServerCallContext context)
        {
            return Task.FromResult(new SimplifyTextResponse { ConvertedText = _openCc.SimplifyHukziuText(request.Text) });
        }
    }
}
