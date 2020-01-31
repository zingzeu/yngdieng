using System.Threading.Tasks;
using Yngdieng.Protos;
using Grpc.Core;
using System.Linq;
namespace Yngdieng.Backend.Services
{
  public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
  {

    public override Task<AggregatedDocument> GetAggregatedDocument(GetAggregatedDocumentRequest request, ServerCallContext context)
    {
      var maybeResult = _indexHolder.GetIndex().AggregatedDocument.Where(f => f.Id == request.Id).FirstOrDefault();
      if (maybeResult == null)
      {
        throw new RpcException(new Status(StatusCode.NotFound, "Not found"));
      }
      return Task.FromResult(maybeResult);
    }
  }


}
