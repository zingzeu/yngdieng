using System;
using System.Threading.Tasks;
using Yngdieng.Protos;
using static Yngdieng.Protos.Query.Types;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Collections.Generic;
namespace Yngdieng.Backend.Services
{
  public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
  {

    public override Task<GetDocumentResponse> GetDocument(GetDocumentRequest request, ServerCallContext context)
    {
      _logger.LogInformation("GetDocumentRequest: " + request.ToString());
      switch (request.DocumentIdCase)
      {
        case GetDocumentRequest.DocumentIdOneofCase.CiklinId:
          {
            var ciklinId = request.CiklinId;
            var matchedDocument = _indexHolder
                .GetIndex()
                .Documents
                .Where(document =>
                    (document as Document).CiklinId == ciklinId)
                .FirstOrDefault();
            return Task.FromResult(new GetDocumentResponse()
            {
              Document = matchedDocument
            });
          }
        case GetDocumentRequest.DocumentIdOneofCase.DfdId:
          {
            var dfdId = request.DfdId;
            var matchedDocument = _indexHolder.GetIndex().Documents.Where(document => (document as Document).DfdId == dfdId).FirstOrDefault();
            return Task.FromResult(new GetDocumentResponse()
            {
              Document = matchedDocument
            });
          }
        default:
          throw new Exception("Bad request");
      }
    }

  }

}
