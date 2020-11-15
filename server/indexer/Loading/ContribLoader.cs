extern alias zingzeudata;
using System.Collections.Generic;
using Yngdieng.Protos;
using static Yngdieng.Common.ExplanationUtil;

namespace Yngdieng.Indexer.Loading
{

    public sealed class ContribLoader
    {
        private readonly string contribPath;

        public ContribLoader(string contribPath)
        {
            this.contribPath = contribPath;
        }

        public IEnumerable<ContribDocument> Run()
        {
            var contribEntries =
                zingzeudata.ZingzeuData.Parser.ParseContrib.GetContribEntries(contribPath);
            var results = new List<ContribDocument>();
            for (var i = 0; i < contribEntries.Count; ++i)
            {
                var entry = contribEntries[i];
                var tmp = new ContribDocument
                {
                    Hanzi = entry.Hanzi.Replace("*", ""),
                    YngpingUnderlying = entry.PronUnderlying,
                    YngpingSandhi = entry.PronSandhi,
                    ExplanationRaw = entry.ExplanationRaw,
                    ExplanationStructured = SafeParseExplanation(entry.ExplanationRaw),
                    Contributors = { entry.Contributors }
                };
                if (string.IsNullOrEmpty(entry.ZingzeuId))
                {
                    tmp.RowNumber = i + 1;
                }
                else
                {
                    tmp.ZingzeuId = entry.ZingzeuId;
                }
                results.Add(tmp);
            }
            return results;
        }
    }

}
