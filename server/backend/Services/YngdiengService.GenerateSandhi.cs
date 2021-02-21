using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using LibHokchew.Shared.Yngping;
using Yngdieng.Backend.TextToSpeech;
using Yngdieng.Protos;
namespace Yngdieng.Backend.Services
{
    public partial class YngdiengService : Yngdieng.Protos.YngdiengService.YngdiengServiceBase
    {

        public override Task<GenerateSandhiResponse> GenerateSandhi(GenerateSandhiRequest request,
                                                     ServerCallContext context)
        {
            var results = new List<GenerateSandhiResponse.Types.SandhiResult>();

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
                    var result = new GenerateSandhiResponse.Types.SandhiResult
                    {
                        Output = output
                    };
                    if (YngpingTtsUtil.IsPronounceable(output))
                    {
                        result.AudioUrl = "https://api.ydict.net/tts/" + Uri.EscapeDataString(output) + ".mp3";
                    };
                    results.Add(result);
                }
                catch (Exception e)
                {
                    results.Add(new GenerateSandhiResponse.Types.SandhiResult
                    {
                        HasError = true
                    });
                }
            }
            return Task.FromResult(new GenerateSandhiResponse
            {
                Results = { results }
            });
        }
    }
}
