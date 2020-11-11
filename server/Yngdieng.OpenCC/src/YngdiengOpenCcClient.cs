using System;
using OpenCC;

namespace Yngdieng.OpenCC
{
    public sealed class YngdiengOpenCcClient : IDisposable
    {

        private readonly OpenCcClient MandarinClient;
        private readonly OpenCcClient HokchewClient;

        public YngdiengOpenCcClient()
        {
            MandarinClient = new OpenCcClient(OpenCcClient.ConfigT2S);
            HokchewClient = new OpenCcClient("opencc_hokchew/t2sh.json");
        }

        public string SimplifyMandarinText(string traditional)
        {
            return MandarinClient.Convert(traditional);
        }

        public string SimplifyHukziuText(string traditional)
        {
            return HokchewClient.Convert(traditional);
        }

        public void Dispose()
        {
            MandarinClient.Dispose();
            HokchewClient.Dispose();
        }
    }
}
