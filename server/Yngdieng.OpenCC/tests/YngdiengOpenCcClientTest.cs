using System;
using Xunit;
using Yngdieng.OpenCC;

namespace Yngdieng.OpenCC.Tests
{
    public class YngdiengOpenCcClientTest
    {
        [Fact]
        public void TestSimplifyHukziuText()
        {
            using (var openCc = new YngdiengOpenCcClient())
            {
                Assert.Equal("侬裡", openCc.SimplifyHukziuText("儂裡"));
            }
        }

        [Fact]
        public void TestSimplifyMandarinText()
        {
            using (var openCc = new YngdiengOpenCcClient())
            {
                Assert.Equal("侬里", openCc.SimplifyMandarinText("儂裡"));
            }
        }
    }
}
