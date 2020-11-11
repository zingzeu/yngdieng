using System;
using OpenCC;
using Xunit;

namespace OpenCC.Tests
{
    public class OpenCcClientTest
    {
        [Fact]
        public void SimplifiedToTranditional()
        {
            using (var client = new OpenCcClient())
            {
                Assert.Equal("誇誇其談 夸父逐日", client.Convert("夸夸其谈 夸父逐日"));
            }
        }

        [Fact]
        public void TraditionalToSimplified()
        {
            using (var client = new OpenCcClient(OpenCcClient.ConfigT2S))
            {
                Assert.Equal("曾经有一份真诚的爱情放在我面前",
                    client.Convert("曾經有一份真誠的愛情放在我面前"));
            }
        }
    }
}
