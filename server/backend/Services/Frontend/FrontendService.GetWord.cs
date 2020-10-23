using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Yngdieng.Backend.Db;
using Yngdieng.Frontend.V1.Protos;

namespace Yngdieng.Backend.Services.Frontend
{
    public partial class FrontendService : Yngdieng.Frontend.V1.Protos.FrontendService.FrontendServiceBase
    {
        public async override Task<Yngdieng.Frontend.V1.Protos.Word> GetWord(GetWordRequest request,
                                                   ServerCallContext context)
        {

            if (string.IsNullOrEmpty(request.Name))
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "name must not be empty"));
            }
            var docId = ResourceNames.ToDocId(request.Name);

            if (_indexHolder.GetIndex().DocIdRedirections.ContainsKey(docId))
            {
                var redirectionTarget = _indexHolder.GetIndex().DocIdRedirections[docId];
                _logger.LogInformation($"DocId Redirection: {docId} -> {redirectionTarget}");
                docId = redirectionTarget;
            }

            return new Yngdieng.Frontend.V1.Protos.Word
            {
                Name = docId
            };
        }
    }
}
