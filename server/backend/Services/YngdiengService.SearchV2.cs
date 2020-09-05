using System.Threading.Tasks;
using Yngdieng.Protos;
using Grpc.Core;
using System.Linq;
using Microsoft.Extensions.Logging;
namespace Yngdieng.Backend.Services
{
    public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
    {

        public override Task<SearchV2Response> SearchV2(SearchV2Request request,
                                                        ServerCallContext context)
        {
            return Task.FromResult(new SearchV2Response{
                ResultCards = {new SearchV2Response.Types.SearchCard{
                                   Word =
                                       new SearchV2Response.Types.SearchCard.Types.WordCard{
                                         Id="ICQ",
                                         Yngping = RichTextUtil.FromString("ziu55 laing213"),
                                         Hanzi = RichTextUtil.FromString("酒店"),
                                         Details = RichTextUtil.FromString("指卖酒的鋪子，現多用做賓館飯店的名稱")
                                       }},
                               new SearchV2Response.Types.SearchCard{
                                   EndOfResults = new SearchV2Response.Types.SearchCard.Types
                                                      .EndOfResultsCard(),
                               }},
                NextPageToken = ""});
        }
    }

}
