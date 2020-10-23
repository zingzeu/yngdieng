
using Google.Protobuf;
using Microsoft.AspNetCore.WebUtilities;
using Yngdieng.Protos;
namespace Yngdieng.Common
{
    public static class DocRefs
    {
        public static DocRef Decode(string docId)
        {
            return DocRef.Parser.ParseFrom(Base64UrlTextEncoder.Decode(docId));
        }

        public static string Encode(DocRef docRef)
        {
            return Base64UrlTextEncoder.Encode(docRef.ToByteArray());
        }
    }
}
