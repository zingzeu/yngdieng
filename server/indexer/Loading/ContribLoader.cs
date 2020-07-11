extern alias zingzeudata;
using System.Collections.Generic;
using System;
using System.IO;
using System.Linq;
using ZingzeuData.Models;
using ZingzeuData.Parser;
using Yngdieng.Protos;
using static Yngdieng.Indexer.ExplanationUtil;

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
                var tmp = new ContribDocument{Hanzi = entry.Hanzi,
                                              YngpingUnderlying = entry.PronUnderlying,
                                              YngpingSandhi = entry.PronSandhi,
                                              ExplanationRaw = entry.ExplanationRaw,
                                              ExplanationStructured =
                                                  SafeParseExplanation(entry.ExplanationRaw)};
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