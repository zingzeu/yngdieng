using System;
using System.Threading.Tasks;
using Grpc.Core;
using Yngdieng.Common;
// using Yngdieng.Frontend.V3.Protos;
using Yngdieng.Protos;

namespace Yngdieng.Backend.Services.Frontend
{
    public partial class FrontendService : Yngdieng.Frontend.V3.Protos.FrontendService.FrontendServiceBase
    {

        public async override Task<Yngdieng.Frontend.V3.Protos.GetHomeFeedResponse> GetHomeFeed(Google.Protobuf.WellKnownTypes.Empty empty,
            ServerCallContext context)
        {
            var docName = "GetRandomDocName()";
            var docId = ResourceNames.ToDocId(docName);
            DocRef docRef;
            try
            {
                docRef = DocRefs.Decode(docId);
            }
            catch (Exception e)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, $"{docId} is not a valid doc id.", e));
            }
            var userPreference = UserPreferences.FromContext(context);
            var zhConverter = new ZhConverter(_openCc, userPreference.ZhConversionPreference);
            var word = Words.GetWord(_indexHolder, _dbContext, zhConverter, docRef);
            var response = new Yngdieng.Frontend.V3.Protos.GetHomeFeedResponse();
            return response;
        }
    }
}
