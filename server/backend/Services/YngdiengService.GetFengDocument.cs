using System.Threading.Tasks;
using Yngdieng.Protos;
using Grpc.Core;
using System.Linq;
namespace Yngdieng.Backend.Services
{
  public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
  {

    public override Task<FengDocument> GetFengDocument(GetFengDocumentRequest request, ServerCallContext context)
    {
      return Task.FromResult(_indexHolder.GetIndex().FengDocuments.Where(f => f.Id == request.Id).FirstOrDefault());
    }
  }


}
