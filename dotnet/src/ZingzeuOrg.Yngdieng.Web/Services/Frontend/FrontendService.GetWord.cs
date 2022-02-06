using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ZingzeuOrg.Yngdieng.Web.Db;
using Yngdieng.Common;
using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;
using FrontendProtos = Yngdieng.Frontend.V3.Protos;

namespace ZingzeuOrg.Yngdieng.Web.Services.Frontend
{
    public partial class FrontendService : FrontendProtos.FrontendService.FrontendServiceBase
    {
        public async override Task<FrontendProtos.Word> GetWord(GetWordRequest request,
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
            DocRef docRef;
            try
            {
                docRef = DocRefs.Decode(docId);
            }
            catch (Exception e)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, $"{request.Name} is not a valid name.", e));
            }
            var userPreference = UserPreferences.FromContext(context);
            var zhConverter = new ZhConverter(_openCc, userPreference.ZhConversionPreference);
            return await Words.GetWord(_indexHolder, _dbContext, zhConverter, docRef);
        }

    }
}
