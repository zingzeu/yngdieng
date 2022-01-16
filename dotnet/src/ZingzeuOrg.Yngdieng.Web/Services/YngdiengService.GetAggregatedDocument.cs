using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Yngdieng.Protos;
namespace ZingzeuOrg.Yngdieng.Web.Services
{
    public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
    {

        public override Task<HistoricalDocument> GetAggregatedDocument(
            GetAggregatedDocumentRequest request, ServerCallContext context)
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
