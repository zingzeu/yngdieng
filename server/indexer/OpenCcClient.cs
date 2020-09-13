using System.Net.Http;
using System.Text;

namespace Yngdieng.Indexer
{

    public sealed class OpenCcClient
    {
        private static readonly string OpenCCDaemon = "http://localhost:8081";
        private static readonly HttpClient client = new HttpClient();
        public string SimplifyHukziuText(string traditional)
        {
            return client
                .PostAsync(OpenCCDaemon, new ByteArrayContent(Encoding.UTF8.GetBytes(traditional)))
                .Result.Content.ReadAsStringAsync()
                .Result;
        }

    }
}
