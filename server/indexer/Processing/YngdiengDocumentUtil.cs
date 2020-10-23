extern alias zingzeudata;
using System;
using System.Collections.Generic;
using System.Linq;
using Google.Protobuf;
using Microsoft.AspNetCore.WebUtilities;
using Yngdieng.Common;
using Yngdieng.Protos;
using zingzeudata.ZingzeuData.Models;
using static Yngdieng.Protos.YngdiengDocument.Types.Source;
using static zingzeudata.ZingzeuData.Models.ZingzeuEntryExtensions;

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
                var tmp = new YngdiengDocument
                {
                    DocRef = new DocRef { ZingzeuId = zingzeuId },
                    HanziCanonical = new Hanzi { Regular = zingzeuWordsEntry.Hanzi },
                    YngpingSandhi =
                        zingzeuWordsEntry.Prons.FirstOrDefault()?.Pron() ?? string.Empty,
                    HanziAlternatives = { zingzeuWordsEntry.HanziAlt.Select(a => new Hanzi { Regular = a }) },
                    IndexingExtension = new YngdiengDocument.Types.IndexingExtension
                    {
                        MandarinWords = { zingzeuWordsEntry.MandarinWords }
                    }
                };

                // TODO: Match Historical Docs
                var fengMatches = pendingFeng.Where(f => f.ZingzeuId == zingzeuId).ToArray();
                foreach (var fengMatch in fengMatches)
                {
                    pendingFeng.Remove(fengMatch);
                    tmp.Sources.Add(new YngdiengDocument.Types.Source { Feng = fengMatch });
                }

                var contribMatch =
                    pendingContrib.Where(c => c.ZingzeuId == zingzeuId).SingleOrDefault();
                if (contribMatch != null)
                {
                    pendingContrib.Remove(contribMatch);
                    tmp.Sources.Add(new YngdiengDocument.Types.Source { Contrib = contribMatch });
                }

                results.Add(tmp);
            }
            Console.WriteLine($"{results.Count} matched.");
            // 第二阶段: 无 zingzeu_id 的，各自单独生成 YngdiengDocument
            Console.WriteLine($"{pendingHistorical.Count} unmatched historicalDocs.");
            Console.WriteLine($"{pendingFeng.Count} unmatched fengDocs.");
            Console.WriteLine($"{pendingContrib.Count} unmatched contribDocs.");
            foreach (var h in pendingHistorical)
            {
                results.Add(new YngdiengDocument
                {
                    DocRef = new DocRef { HistoricalDocId = h.Id },
                    Sources = { new YngdiengDocument.Types.Source { CiklinDfd = h } }
                });
            }
            foreach (var f in pendingFeng)
            {
                results.Add(
                    new YngdiengDocument
                    {
                        DocRef = new DocRef { FengId = f.Id },
                        Sources = { new YngdiengDocument.Types.Source { Feng = f } }
                    });
            }
            foreach (var c in pendingContrib)
            {
                results.Add(new YngdiengDocument
                {
                    DocRef = new DocRef { ContribRowNumber = c.RowNumber },
                    Sources = { new YngdiengDocument.Types.Source { Contrib = c } }
                });
            }
            // Generated base64 encoded doc id
            foreach (var doc in results)
            {
                doc.DocId = Base64UrlTextEncoder.Encode(doc.DocRef.ToByteArray());
                doc.HanziCanonical = FindHanziCanonical(doc.Sources, doc.HanziCanonical);
                doc.YngpingUnderlying = FindYngpingUnderlying(doc.Sources, doc.YngpingUnderlying);
                doc.YngpingSandhi = FindYngpingSandhi(doc.Sources, doc.YngpingSandhi);
                doc.IndexingExtension = doc.IndexingExtension ?? new YngdiengDocument.Types.IndexingExtension { };
                doc.IndexingExtension.YngpingPermutations.AddRange(CollectYngpingPermutations(doc.Sources));
                doc.IndexingExtension.HanziMatchable.AddRange(CollectHanziMatchable(doc.Sources));
                doc.IndexingExtension.ExplanationText.AddRange(CollectExplanationTexts(doc.Sources));
            }
            return results;
        }

        private static Hanzi FindHanziCanonical(
            IReadOnlyCollection<YngdiengDocument.Types.Source> sources, Hanzi fromZingzeuWords)
        {
            var feng =
                sources.FirstOrDefault(s => s.SourceCase == SourceOneofCase.Feng)?.Feng ?? null;
            if (feng != null)
            {
                return new Hanzi
                {/* TODO: check for IDS in FengDocument.HanziCanonical */
                    Regular = feng.HanziCanonical
                };
            }
            if (fromZingzeuWords != null)
            {
                return fromZingzeuWords;
            }
            var historicalDoc =
                sources.FirstOrDefault(s => s.SourceCase == SourceOneofCase.CiklinDfd)
                ?.CiklinDfd ?? null;
            if (historicalDoc != null)
            {
                return historicalDoc.HanziCanonical;
            }
            var contrib = sources.FirstOrDefault(s => s.SourceCase == SourceOneofCase.Contrib)
                ?.Contrib ?? null;
            if (contrib != null)
            {
                return new Hanzi
                {/* TODO: check for IDS in ContribDocument.Hanzi */
                    Regular = contrib.Hanzi
                };
            }
            return null;
        }

        private static string FindYngpingUnderlying(
            IReadOnlyCollection<YngdiengDocument.Types.Source> sources, string fromZingzeuWords)
        {
            var feng =
                sources.FirstOrDefault(s => s.SourceCase == SourceOneofCase.Feng)?.Feng ?? null;
            if (feng != null)
            {
                return feng.YngpingUnderlying;
            }
            if (!string.IsNullOrEmpty(fromZingzeuWords))
            {
                return fromZingzeuWords;
            }
            var historicalDoc =
                sources.FirstOrDefault(s => s.SourceCase == SourceOneofCase.CiklinDfd)
                ?.CiklinDfd ?? null;
            if (historicalDoc != null)
            {
                return historicalDoc.YngpingModern;
            }
            var contrib = sources.FirstOrDefault(s => s.SourceCase == SourceOneofCase.Contrib)
                ?.Contrib ?? null;
            if (contrib != null)
            {
                return contrib.YngpingUnderlying;
            }
            return string.Empty;
        }

        private static string FindYngpingSandhi(
            IReadOnlyCollection<YngdiengDocument.Types.Source> sources, string fromZingzeuWords)
        {
            var feng =
                sources.FirstOrDefault(s => s.SourceCase == SourceOneofCase.Feng)?.Feng ?? null;
            if (feng != null)
            {
                return feng.YngpingCanonical;
            }
            if (!string.IsNullOrEmpty(fromZingzeuWords))
            {
                return fromZingzeuWords;
            }
            var contrib = sources.FirstOrDefault(s => s.SourceCase == SourceOneofCase.Contrib)
                ?.Contrib ?? null;
            if (contrib != null)
            {
                return contrib.YngpingSandhi;
            }
            return string.Empty;
        }

        private static string[] CollectYngpingPermutations(
            IReadOnlyCollection<YngdiengDocument.Types.Source> sources)
        {
            return sources
                .SelectMany(s =>
                {
                    switch (s.SourceCase)
                    {
                        case SourceOneofCase.CiklinDfd:
                            return new string[] { s.CiklinDfd.Yngping };
                        case SourceOneofCase.Feng:
                            return s.Feng.YngpingPermutations.ToArray();
                        case SourceOneofCase.Contrib:
                            return YngpingVariantsUtil.GenerateYngpingVariants(s.Contrib.YngpingSandhi)
                                .Concat(new string[] { s.Contrib.YngpingUnderlying });
                    }
                    return new string[] { };
                })
                .Distinct()
                .ToArray();
        }
        private static string[] CollectHanziMatchable(
            IReadOnlyCollection<YngdiengDocument.Types.Source> sources)
        {
            return sources
                .SelectMany(s =>
                {
                    switch (s.SourceCase)
                    {
                        case SourceOneofCase.CiklinDfd:
                            return s.CiklinDfd.HanziMatchable.ToArray();
                        case SourceOneofCase.Feng:
                            return s.Feng.HanziMatchable.ToArray();
                        case SourceOneofCase.Contrib:
                            // TODO: simplify contrib hanzi
                            return new string[] { };
                    }
                    return new string[] { };
                })
                .Distinct()
                .ToArray();
        }

        private static string[] CollectExplanationTexts(
            IReadOnlyCollection<YngdiengDocument.Types.Source> sources)
        {
            return sources
                .SelectMany(s =>
                {
                    switch (s.SourceCase)
                    {
                        case SourceOneofCase.Feng:
                            return new string[] { s.Feng.ExplanationTrad, s.Feng.ExplanationHans };
                        case SourceOneofCase.Contrib:
                            return new string[]{s.Contrib.ExplanationRaw,
                                /* TODO: simplified variant */
                                                                          };
                        case SourceOneofCase.CiklinDfd:
                            return new string[] { };
                    }
                    return new string[] { };
                })
                .Distinct()
                .ToArray();
        }
    }
}
