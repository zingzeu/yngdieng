using Google.Protobuf;
using Lucene.Net.Search;
using Microsoft.AspNetCore.WebUtilities;
using Yngdieng.Protos;

namespace ZingzeuOrg.Yngdieng.Web
{

    public static class PaginationTokens
    {

        public static PaginationToken Parse(string encoded)
        {
            // TODO: error handling
            return PaginationToken.Parser.ParseFrom(WebEncoders.Base64UrlDecode(encoded));
        }

        public static string FromScoreDoc(ScoreDoc scoreDoc)
        {
            return WebEncoders.Base64UrlEncode(
                new PaginationToken
                {
                    LastDoc = new PaginationToken.Types.ScoreDoc
                    {
                        Score = scoreDoc.Score,
                        Doc = scoreDoc.Doc
                    }
                }.ToByteArray()
            );
        }

    }
}
