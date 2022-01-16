using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using YngdiengProtos = Yngdieng.Protos;
namespace ZingzeuOrg.Yngdieng.Web.Services
{
    public partial class YngdiengService : YngdiengProtos.YngdiengService.YngdiengServiceBase
    {

        public override Task<YngdiengProtos.HistoricalDocument> GetAggregatedDocument(
            YngdiengProtos.GetAggregatedDocumentRequest request, ServerCallContext context)
        {
            var maybeResult = _indexHolder.GetIndex()
                                  .HistoricalDocuments.Where(f => f.Id == request.Id)
                                  .FirstOrDefault();
            if (maybeResult == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, "Not found"));
            }
            return Task.FromResult(maybeResult);
        }
    }
}
