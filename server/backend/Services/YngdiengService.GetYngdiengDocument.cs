using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using Yngdieng.Protos;
namespace Yngdieng.Backend.Services
{
    public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
    {

        public override Task<YngdiengDocument> GetYngdiengDocument(
            GetYngdiengDocumentRequest request, ServerCallContext context)
        {
            var docId = request.Id;
            if (_indexHolder.GetIndex().DocIdRedirections.ContainsKey(docId))
            {
                var redirectionTarget = _indexHolder.GetIndex().DocIdRedirections[docId];
                _logger.LogInformation($"DocId Redirection: {docId} -> {redirectionTarget}");
                docId = redirectionTarget;
            }
            return Task.FromResult(
                SantizeForServing(_indexHolder.GetIndex()
                                      .YngdiengDocuments.Where(d => d.DocId == docId)
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
