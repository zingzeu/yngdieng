using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Yngdieng.Protos;
using Yngdieng.Common;
using System.Net.Http;
using System.Text;

namespace Yngdieng.Indexer
{
  public sealed class CreateFengDocumentsAction
  {

    private static readonly string OpenCCDaemon = "http://localhost:8081";
    private static readonly HttpClient client = new HttpClient();
    private readonly string mergedPath;
    private readonly string outputFolder;

    public CreateFengDocumentsAction(string mergedPath, string outputFolder)
    {
      this.mergedPath = mergedPath;
      this.outputFolder = outputFolder;
    }

    public IEnumerable<FengDocument> Run()
    {
      var jsonOutput = new List<string>();
      var documents = new List<FengDocument>();

      var docs = LoadFengRows(mergedPath).Select(f =>
      {
        var tmp = new FengDocument
        {
          Id = $"p{f.PageNumber}_{f.LineNumber}",
          HanziCanonical = f.KanjiClean,
          YngpingCanonical = f.Pron,
          Explanation = f.Explanation,
          ExplanationHans = Simplify(f.Explanation),
          Source = new FengDocument.Types.SourceInfo
          {
            PageNumber = f.PageNumber,
            LineNumber = f.LineNumber
          },
        };
        tmp.HanziMatchable.Add(f.KanjiClean);
        tmp.HanziMatchable.Add(Simplify(f.KanjiClean));
        tmp.YngpingPermutations.Add(f.Pron);
        tmp.YngpingPermutations.AddRange(YngpingVariantsUtil.GenerateYngpingVariants(f.Pron));
        return tmp;
      });

      documents.AddRange(docs);
      jsonOutput.AddRange(docs.Select(proto => proto.ToString()));
      File.WriteAllLines(Path.Combine(outputFolder, "feng_index_debug.txt"), jsonOutput);
      return documents;
    }

    public static FengRow[] LoadFengRows(string path)
    {
      var mlines = File.ReadAllLines(path);
      var mEntries = mlines
          .Select((x, index) => new
          {
            Line = x,
            Index = index + 1
          })
          .Where(x => !x.Line.StartsWith("==="))
          .Select(x => new
          {
            x.Index,
            Tokens = x.Line.Split('\t')
          })
          .Where(x => x.Tokens.Length > 1)
          .Select(x => new FengRow
          {
            GlobalLineNumber = x.Index,
            Pron = x.Tokens[2].Trim(),
            KanjiClean = CleanKanji(GetKanji(x.Tokens[0])),
            Explanation = ReplaceAllBraces(String.Join(" ", x.Tokens[2..^0]))
          })
          .ToArray();

      var mPageBreaks = mlines
          .Select((x, index) => new
          {
            Line = x,
            Index = index + 1
          })
          .Where(x => x.Line.StartsWith("==="))
          .Select(x => new
          {
            LineNumber = x.Index,
            PageNumber = int.Parse(x.Line.Substring(x.Line.IndexOf("PAGE=", StringComparison.Ordinal) + 5))
          }).ToArray();

      // Assign page number
      var numInPage = 1;
      for (int i = 0, j = 0; i < mEntries.Length; ++i)
      {
        while (j < mPageBreaks.Length - 1 && mPageBreaks[j + 1].LineNumber < mEntries[i].GlobalLineNumber) { ++j; numInPage = 1; }
        mEntries[i].PageNumber = mPageBreaks[j].PageNumber;
        mEntries[i].LineNumber = numInPage++;
      }
      return mEntries;
    }

    public static string GetKanji(string input)
    {
      var start = input.IndexOf("【");
      var end = input.IndexOf("】");
      if (end <= start)
      {
        throw new Exception("GetKanji Error " + input);
      }
      return input.Substring(start + 1, end - start - 1);
    }

    private static string CleanKanji(string input)
    {
      var s = input.Trim();
      while (true)
      {
        var tmp = ReplaceBracesOnce(s);
        if (tmp == s) break;
        s = tmp;
      }
      return s.Replace("*", "");
    }

    private static string ReplaceBracesOnce(string input)
    {
      var bStart = input.IndexOf("{");
      var bEnd = input.IndexOf("}");
      if (bStart == -1 || bEnd == -1)
      {
        return input;
      }
      var bComma = input.Substring(bStart).IndexOf(",") + bStart;
      if (!(bStart < bComma && bComma < bEnd))
      {
        throw new Exception($"Error input: {input}. BraceStart={bStart} Comma={bComma} BraceEnd={bEnd}");
      }
      var corrected = input.Substring(bComma + 1, bEnd - bComma - 1);
      return input.Substring(0, bStart) + corrected + input.Substring(bEnd + 1);
    }

    private static string ReplaceAllBraces(string input)
    {
      var tmp = input;
      while (true)
      {
        var replaced = ReplaceBracesOnce(tmp);
        if (tmp == replaced)
        {
          return tmp;
        }
        tmp = replaced;
      }
    }

    private static string Simplify(string traditional)
    {
      return client.PostAsync(OpenCCDaemon, new ByteArrayContent(Encoding.UTF8.GetBytes(traditional))).Result.Content.ReadAsStringAsync().Result;
    }
  }


  /// <summary>
  /// Model for each row in merged.txt.
  /// </summary>
  public class FengRow
  {
    /// <summary>
    /// Line number in merged.txt.
    /// </summary>
    public int GlobalLineNumber { get; set; }
    /// <summary>
    /// Line number in page
    /// </summary>
    public int LineNumber { get; set; }
    public int PageNumber { get; set; }
    public string Pron { get; set; }
    public string KanjiClean { get; set; }

    public string Explanation { get; set; }
  }
}
