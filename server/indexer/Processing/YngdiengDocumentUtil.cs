extern alias zingzeudata;
using System;
using System.Collections.Generic;
using Yngdieng.Protos;
using Yngdieng.Common;
using Google.Protobuf;
using System.Linq;
using static zingzeudata.ZingzeuData.Models.ZingzeuEntryExtensions;
using zingzeudata.ZingzeuData.Models;
using Microsoft.AspNetCore.WebUtilities;
using static Yngdieng.Protos.YngdiengDocument.Types.Source;

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
        if (doc.HanziCanonical == null)
        {
          doc.HanziCanonical = FindHanziCanonical(doc.Sources);
        }
        if (doc.YngpingUnderlying == string.Empty)
        {
          doc.YngpingUnderlying = FindYngpingUnderlying(doc.Sources);
        }
        if (doc.YngpingSandhi == string.Empty)
        {
          doc.YngpingSandhi = FindYngpingSandhi(doc.Sources);
        }
        doc.IndexingExtension = new YngdiengDocument.Types.IndexingExtension
        {
          YngpingPermutations = { CollectYngpingPermutations(doc.Sources) },
          HanziMatchable = { CollectHanziMatchable(doc.Sources) },
          ExplanationText = { CollectExplanationTexts(doc.Sources) }
        };
      }
      return results;
    }

    private static Hanzi FindHanziCanonical(
        IReadOnlyCollection<YngdiengDocument.Types.Source> sources)
    {
      var feng =
          sources.FirstOrDefault(s => s.SourceCase == SourceOneofCase.Feng)?.Feng ?? null;
      if (feng != null)
      {
        return new Hanzi
        {/* TODO: check for IDS in FengDocument.HanziCanonical */
          Regular =
                             feng.HanziCanonical
        };
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
          Regular =
                             contrib.Hanzi
        };
      }
      return null;
    }

    private static string FindYngpingUnderlying(
        IReadOnlyCollection<YngdiengDocument.Types.Source> sources)
    {
      var feng =
          sources.FirstOrDefault(s => s.SourceCase == SourceOneofCase.Feng)?.Feng ?? null;
      if (feng != null)
      {
        return feng.YngpingUnderlying;
      }
      var historicalDoc =
          sources.FirstOrDefault(s => s.SourceCase == SourceOneofCase.CiklinDfd)
          ?.CiklinDfd ?? null;
      if (historicalDoc != null)
      {
        // TODO: convert to modern yngping
        return historicalDoc.Yngping;
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
        IReadOnlyCollection<YngdiengDocument.Types.Source> sources)
    {
      var feng =
          sources.FirstOrDefault(s => s.SourceCase == SourceOneofCase.Feng)?.Feng ?? null;
      if (feng != null)
      {
        return feng.YngpingCanonical;
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
                return new string[] { s.Feng.Explanation, s.Feng.ExplanationHans };
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
