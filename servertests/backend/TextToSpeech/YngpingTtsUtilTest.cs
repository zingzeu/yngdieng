using System;
using Xunit;
using Yngdieng.Protos;
using Yngdieng.Backend.TextToSpeech;

namespace Yngdieng.Backend.TextToSpeech.Tests
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
        [InlineData("nguai55", "143401")]
        [InlineData("nguai33", "143402")]
        [InlineData("nguai33", "143402")]
        public void TestSyllableToAudio(string yngping, string expectedFileName)
        {
            Assert.Equal(expectedFileName, YngpingTtsUtil.SyllableToAudio(yngping));
        }

        [Theory]
        [InlineData("bung24")]
        public void TestSyllableToAudio_UnsupportedSyllable_ReturnsEmpty(string yngping)
        {
            Assert.Equal(string.Empty, YngpingTtsUtil.SyllableToAudio(yngping));
        }
    }
}