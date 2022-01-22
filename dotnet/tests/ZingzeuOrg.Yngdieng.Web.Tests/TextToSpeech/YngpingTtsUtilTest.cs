using System;
using Xunit;
using Yngdieng.Protos;
using ZingzeuOrg.Yngdieng.Web.TextToSpeech;

namespace ZingzeuOrg.Yngdieng.Web.TextToSpeech.Tests
{
    public class YngpingTtsUtilTest
    {
        [Theory]
        [InlineData("bung55", "010101")]
        [InlineData("bung33", "010102")]
        [InlineData("boung213", "010103")]
        [InlineData("bouk24", "010104")]
        [InlineData("bouh24", "010104")]
        [InlineData("bung53", "010105")]
        [InlineData("boung242", "010107")]
        [InlineData("buk5", "010108")]
        [InlineData("buh5", "010108")]
        //[InlineData("buk21", "buk21")]
        //[InlineData("u21", "u21")]
        //[InlineData("uk21", "u21")]
        [InlineData("nguai55", "143401")]
        [InlineData("nguai33", "143402")]
        [InlineData("pak21", "020703")]
        [InlineData("pak33", "020702")]
        [InlineData("ng55", "150801")]
        public void TestSyllableToAudio(string yngping, string expectedFileName)
        {
            Assert.Equal(expectedFileName, YngpingTtsUtil.SyllableToAudio(yngping));
        }

        [Theory]
        [InlineData("bung24")]
        [InlineData("u213")]
        [InlineData("ding21")]
        [InlineData("ding213")]
        public void TestSyllableToAudio_UnsupportedSyllable_ReturnsEmpty(string yngping)
        {
            Assert.Equal(string.Empty, YngpingTtsUtil.SyllableToAudio(yngping));
        }

        [Theory]
        [InlineData("pak21 pak33 tiu213")]
        public void TestIsPronounceable_True(string yngping)
        {
            Assert.True(YngpingTtsUtil.IsPronounceable(yngping));
        }
    }
}
