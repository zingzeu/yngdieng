using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using LibHokchew.Shared.Yngping;
using ZingzeuOrg.Yngdieng.Web.TextToSpeech;
using YngdiengProtos=Yngdieng.Protos;

namespace ZingzeuOrg.Yngdieng.Web.Services
{
    public partial class YngdiengService : YngdiengProtos.YngdiengService.YngdiengServiceBase
    {

        public override Task<YngdiengProtos.GenerateSandhiResponse> GenerateSandhi(YngdiengProtos.GenerateSandhiRequest request,
                                                     ServerCallContext context)
        {
            var results = new List<YngdiengProtos.GenerateSandhiResponse.Types.SandhiResult>();

            foreach (var input in request.Inputs)
            {
                try
                {
                    var inputSyllables = input.ToLowerInvariant().Trim()
                    .Split()
                    .Select(syllable => syllable.Trim())
                    .Where(syllable => syllable.Length > 0)
                    .ToArray();
                    var outputSyllables = SandhiGenerator.GenerateSandhiSyllables(inputSyllables);
                    var output = string.Join(" ", outputSyllables);
                    var result = new YngdiengProtos.GenerateSandhiResponse.Types.SandhiResult
                    {
                        Output = output
                    };
                    if (YngpingTtsUtil.IsPronounceable(output))
                    {
                        result.AudioUrl = "https://api.ydict.net/tts/" + Uri.EscapeDataString(output);
                    };
                    results.Add(result);
                }
                catch (Exception)
                {
                    results.Add(new YngdiengProtos.GenerateSandhiResponse.Types.SandhiResult
                    {
                        HasError = true
                    });
                }
            }
            return Task.FromResult(new YngdiengProtos.GenerateSandhiResponse
            {
                Results = { results }
            });
        }
    }
}
