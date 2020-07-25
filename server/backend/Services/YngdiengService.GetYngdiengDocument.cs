using System.Threading.Tasks;
using Yngdieng.Protos;
using Grpc.Core;
using System.Linq;
namespace Yngdieng.Backend.Services
{
    public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
    {

        public override Task<YngdiengDocument> GetYngdiengDocument(
            GetYngdiengDocumentRequest request, ServerCallContext context)
        {
            return Task.FromResult(
                SantizeForServing(_indexHolder.GetIndex()
                                      .YngdiengDocuments.Where(d => d.DocId == request.Id)
                                      .FirstOrDefault()));
        }

        private static YngdiengDocument SantizeForServing(YngdiengDocument doc)
        {
            var copy = new YngdiengDocument(doc);
            copy.DocRef = null;
            copy.IndexingExtension = null;
            return copy;
        }
    }

}
