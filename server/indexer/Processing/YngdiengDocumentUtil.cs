extern alias zingzeudata;
using System;
using System.Collections.Generic;
using Yngdieng.Protos;
using Yngdieng.Common;
using Google.Protobuf;
using System.Linq;
using Microsoft.AspNetCore.WebUtilities;

namespace Yngdieng.Indexer.Processing
{
    /// <summary>
    /// 将各种来源(contrib, feng, li, etc.)的词条,合并成YngdiengDocument.
    /// </summary>
    public static class YngdiengDocumentUtil
    {

        public static IEnumerable<YngdiengDocument> Combine(
            IEnumerable<zingzeudata.ZingzeuData.Models.ZingzeuEntry> zingzeuEntries,
            IEnumerable<HistoricalDocument> historicalDocs,
            IEnumerable<FengDocument> fengDocs,
            IEnumerable<ContribDocument> contribDocs)
        {
            var results = new List<YngdiengDocument>();
            var pendingFeng = new List<FengDocument>(fengDocs);
            var pendingHistorical = new List<HistoricalDocument>(historicalDocs);
            var pendingContrib = new List<ContribDocument>(contribDocs);
            // 第一阶段: 有 zingzeu_id 的，按相同 zingzeu_id 合并成 YngdiengDocument
            foreach (var zingzeuWordsEntry in zingzeuEntries)
            {
                var zingzeuId = zingzeuWordsEntry.Id;
                var tmp = new YngdiengDocument{DocRef = new DocRef{ZingzeuId = zingzeuId}};

                // TODO: Match Historical Docs
                var fengMatches = pendingFeng.Where(f => f.ZingzeuId == zingzeuId).ToArray();
                foreach (var fengMatch in fengMatches)
                {
                    pendingFeng.Remove(fengMatch);
                    tmp.Sources.Add(new YngdiengDocument.Types.Source{Feng = fengMatch});
                }

                var contribMatch =
                    pendingContrib.Where(c => c.ZingzeuId == zingzeuId).SingleOrDefault();
                if (contribMatch != null)
                {
                    pendingContrib.Remove(contribMatch);
                    tmp.Sources.Add(new YngdiengDocument.Types.Source{Contrib = contribMatch});
                }

                if (tmp.Sources.Count > 0)
                {
                    results.Add(tmp);
                }
            }
            Console.WriteLine($"{results.Count} matched.");
            // 第二阶段: 无 zingzeu_id 的，各自单独生成 YngdiengDocument
            Console.WriteLine($"{pendingHistorical.Count} unmatched historicalDocs.");
            Console.WriteLine($"{pendingFeng.Count} unmatched fengDocs.");
            Console.WriteLine($"{pendingContrib.Count} unmatched contribDocs.");
            foreach (var h in pendingHistorical)
            {
                results.Add(new YngdiengDocument{
                    DocRef = new DocRef{HistoricalDocId = h.Id},
                    Sources = {new YngdiengDocument.Types.Source{CiklinDfd = h}}});
            }
            foreach (var f in pendingFeng)
            {
                results.Add(
                    new YngdiengDocument{DocRef = new DocRef{FengId = f.Id},
                                         Sources = {new YngdiengDocument.Types.Source{Feng = f}}});
            }
            foreach (var c in pendingContrib)
            {
                results.Add(new YngdiengDocument{
                    DocRef = new DocRef{ContribRowNumber = c.RowNumber},
                    Sources = {new YngdiengDocument.Types.Source{Contrib = c}}});
            }
            // Generated base64 encoded doc id
            foreach (var doc in results)
            {
                doc.DocId = Base64UrlTextEncoder.Encode(doc.DocRef.ToByteArray());
                // TODO:Populate remaining fields: hanzi_canonical, yngping_underlying,
                // yngping_sandhi, indexing_extension
            }
            return results;
        }
    }
}