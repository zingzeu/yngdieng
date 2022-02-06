using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using YngdiengProtos = Yngdieng.Protos;
namespace ZingzeuOrg.Yngdieng.Web.Services
{
    public partial class YngdiengService : YngdiengProtos.YngdiengService.YngdiengServiceBase
    {

        public override Task<YngdiengProtos.FengDocument> GetFengDocument(YngdiengProtos.GetFengDocumentRequest request,
                                                           ServerCallContext context)
        {
            return Task.FromResult(_indexHolder.GetIndex()
                                       .FengDocuments.Where(f => f.Id == request.Id)
                                       .FirstOrDefault());
        }
    }
}
